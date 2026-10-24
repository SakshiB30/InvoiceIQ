
package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.AIInsightsResponseDTO;
import com.invoiceiq.InvoiceIQ.entity.Invoice;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIInsightsService {

    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-3.5-flash-lite}")
    private String model;

    private RestClient restClient;

    @PostConstruct
    public void initializeRestClient() {
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .defaultHeader("x-goog-api-key", apiKey)
                .defaultHeader(
                        "Content-Type",
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();
    }

    public AIInsightsResponseDTO generateInsights(
            List<Invoice> invoices
    ) {

        List<Invoice> eligibleInvoices = invoices == null
                ? List.of()
                : invoices.stream()
                .filter(invoice -> invoice != null)
                .filter(invoice ->
                        "COMPLETED".equalsIgnoreCase(
                                invoice.getProcessingStatus()
                        )
                )
                .filter(invoice -> {
                    if (invoice.getDuplicate() == null
                            || !invoice.getDuplicate().isPotentialDuplicate()) {
                        return true;
                    }

                    String decision =
                            invoice.getDuplicate().getReviewDecision();

                    return "CONFIRMED_SEPARATE".equals(decision);
                })
                .toList();


        if (eligibleInvoices.isEmpty()) {
            return new AIInsightsResponseDTO(
                    "No confirmed, non-duplicate invoices are available for analysis.",
                    List.of(),
                    List.of(),
                    "N/A",
                    "N/A",
                    0.0,
                    0.0,
                    0
            );
        }

        // Calculate financial metrics deterministically in Java.
        AIInsightsResponseDTO metrics =
                calculateFinancialMetrics(eligibleInvoices);

        try {
            String invoiceData = buildInvoiceData(eligibleInvoices);

            String prompt = """
                    You are an AI business spending insights assistant
                    for InvoiceIQ, a platform used by small businesses.

                    Analyze the eligible invoice data and generate:
                    1. A concise overall spending summary.
                    2. Three to five meaningful spending insights.
                    3. Three practical business recommendations.

                    IMPORTANT RULES:
                    - Use only the provided invoice data.
                    - Do not invent facts, amounts, or spending patterns.
                    - Do not provide investment, tax, legal, or accounting advice.
                    - Keep the language concise and understandable.
                    - Monetary amounts, when mentioned, must be in INR.
                    - Do not calculate or state any financial totals or exact
                      monetary amounts in the summary or insights.
                    - The application calculates all financial metrics separately.
                    - Discuss spending patterns qualitatively using only the
                      supplied invoice data.
                    - Return only valid JSON matching the requested schema.

                    ELIGIBLE INVOICE DATA:
                    %s
                    """.formatted(invoiceData);

            Map<String, Object> requestBody = new HashMap<>();

            Map<String, Object> part = Map.of("text", prompt);

            Map<String, Object> content = Map.of(
                    "parts",
                    List.of(part)
            );

            requestBody.put(
                    "contents",
                    List.of(content)
            );

            Map<String, Object> generationConfig = new HashMap<>();

            generationConfig.put(
                    "responseMimeType",
                    "application/json"
            );

            generationConfig.put(
                    "responseSchema",
                    createInsightsSchema()
            );

            requestBody.put(
                    "generationConfig",
                    generationConfig
            );

            Map<?, ?> response = restClient.post()
                    .uri(
                            "/v1beta/models/"
                                    + model
                                    + ":generateContent"
                    )
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            if (response == null) {
                throw new IllegalStateException(
                        "Gemini returned an empty response"
                );
            }

            JsonNode responseNode =
                    objectMapper.valueToTree(response);

            String jsonText = extractResponseText(responseNode);

            JsonNode aiJson = objectMapper.readTree(jsonText);

            if (aiJson == null || !aiJson.isObject()) {
                throw new IllegalStateException(
                        "Gemini returned an invalid insights response"
                );
            }

            String summary = aiJson.path("summary").asString("");

            if (summary.isBlank()) {
                summary = "Analysis generated for "
                        + metrics.getTotalInvoices()
                        + " eligible invoices. Total spending: ₹"
                        + String.format(
                        java.util.Locale.ROOT,
                        "%.2f",
                        metrics.getTotalSpending()
                )
                        + ". Top category: "
                        + metrics.getTopCategory()
                        + ". Top vendor: "
                        + metrics.getTopVendor()
                        + ".";
            }

            List<String> spendingInsights =
                    extractStringList(aiJson.path("spendingInsights"));

            List<String> recommendations =
                    extractStringList(aiJson.path("recommendations"));

            AIInsightsResponseDTO result = new AIInsightsResponseDTO(
                    summary,
                    spendingInsights,
                    recommendations,
                    metrics.getTopCategory(),
                    metrics.getTopVendor(),
                    metrics.getTotalSpending(),
                    metrics.getMonthlySpending(),
                    metrics.getTotalInvoices()
            );


            // Always use application-calculated financial metrics.
            result.setTotalSpending(metrics.getTotalSpending());
            result.setMonthlySpending(metrics.getMonthlySpending());
            result.setTotalInvoices(metrics.getTotalInvoices());
            result.setTopCategory(metrics.getTopCategory());
            result.setTopVendor(metrics.getTopVendor());

            // Do not log invoice details or the full AI response.
            return result;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to generate AI spending insights",
                    e
            );
        }
    }

    private AIInsightsResponseDTO calculateFinancialMetrics(
            List<Invoice> invoices
    ) {
        BigDecimal totalSpending = BigDecimal.ZERO;
        BigDecimal monthlySpending = BigDecimal.ZERO;

        Map<String, BigDecimal> categoryTotals =
                new LinkedHashMap<>();

        Map<String, BigDecimal> vendorTotals =
                new LinkedHashMap<>();

        LocalDate today = LocalDate.now();

        int totalInvoices = 0;

        for (Invoice invoice : invoices) {
            BigDecimal amount = BigDecimal.valueOf(
                    invoice.getTotalAmount()
            );

            totalSpending = totalSpending.add(amount);
            totalInvoices++;

            if (invoice.getInvoiceDate() != null
                    && invoice.getInvoiceDate().getYear()
                    == today.getYear()
                    && invoice.getInvoiceDate().getMonth()
                    == today.getMonth()) {

                monthlySpending = monthlySpending.add(amount);
            }

            String category = invoice.getCategory();

            if (category == null || category.isBlank()) {
                category = "Uncategorized";
            } else {
                category = category.trim();
            }

            categoryTotals.merge(
                    category,
                    amount,
                    BigDecimal::add
            );

            String vendor = "Unknown";

            if (invoice.getVendor() != null
                    && invoice.getVendor().getName() != null
                    && !invoice.getVendor().getName().isBlank()) {

                vendor = invoice.getVendor().getName().trim();
            }

            vendorTotals.merge(
                    vendor,
                    amount,
                    BigDecimal::add
            );
        }

        return new AIInsightsResponseDTO(
                null,
                List.of(),
                List.of(),
                findTopSpendingKey(categoryTotals),
                findTopSpendingKey(vendorTotals),
                totalSpending.doubleValue(),
                monthlySpending.doubleValue(),
                totalInvoices
        );
    }

    private String findTopSpendingKey(
            Map<String, BigDecimal> totals
    ) {
        return totals.entrySet()
                .stream()
                .max(
                        Comparator
                                .<Map.Entry<String, BigDecimal>,
                                        BigDecimal>comparing(
                                        Map.Entry::getValue
                                )
                                .thenComparing(
                                        Map.Entry::getKey,
                                        Comparator.reverseOrder()
                                )
                )
                .map(Map.Entry::getKey)
                .orElse("N/A");
    }

    private String buildInvoiceData(
            List<Invoice> invoices
    ) {
        StringBuilder data = new StringBuilder();

        for (Invoice invoice : invoices) {
            data.append("\n--- INVOICE ---\n");

            data.append("Invoice Number: ")
                    .append(invoice.getInvoiceNumber())
                    .append("\n");

            data.append("Vendor: ");

            if (invoice.getVendor() != null) {
                data.append(invoice.getVendor().getName());
            } else {
                data.append("Unknown");
            }

            data.append("\n");

            data.append("Invoice Date: ")
                    .append(invoice.getInvoiceDate())
                    .append("\n");

            data.append("Category: ")
                    .append(invoice.getCategory())
                    .append("\n");

            data.append("Subtotal: ")
                    .append(invoice.getSubtotal())
                    .append("\n");

            data.append("Tax: ")
                    .append(invoice.getTax())
                    .append("\n");

            data.append("Total Amount: ")
                    .append(invoice.getTotalAmount())
                    .append("\n");
        }

        return data.toString();
    }

    private String extractResponseText(
            JsonNode response
    ) {
        JsonNode candidates = response.path("candidates");

        if (!candidates.isArray() || candidates.isEmpty()) {
            throw new RuntimeException(
                    "Gemini did not return any candidates"
            );
        }

        JsonNode parts = candidates
                .get(0)
                .path("content")
                .path("parts");

        for (JsonNode part : parts) {
            JsonNode text = part.get("text");

            if (text != null) {
                return text.asText();
            }
        }

        throw new RuntimeException(
                "Gemini response did not contain text"
        );
    }

    private List<String> extractStringList(JsonNode node) {
        if (node == null || !node.isArray()) {
            return List.of();
        }

        List<String> values = new java.util.ArrayList<>();

        for (JsonNode item : node) {
            if (item != null && item.isString()) {
                String value = item.asString("").trim();

                if (!value.isEmpty()) {
                    values.add(value);
                }
            }
        }

        return List.copyOf(values);
    }

    private Map<String, Object> createInsightsSchema() {
        Map<String, Object> schema = new HashMap<>();

        schema.put("type", "OBJECT");

        Map<String, Object> properties = new HashMap<>();

        properties.put(
                "summary",
                Map.of("type", "STRING")
        );

        properties.put(
                "spendingInsights",
                Map.of(
                        "type", "ARRAY",
                        "items", Map.of("type", "STRING")
                )
        );

        properties.put(
                "recommendations",
                Map.of(
                        "type", "ARRAY",
                        "items", Map.of("type", "STRING")
                )
        );

        schema.put("properties", properties);

        schema.put(
                "required",
                List.of(
                        "summary",
                        "spendingInsights",
                        "recommendations"
                )
        );

        return schema;
    }
}
