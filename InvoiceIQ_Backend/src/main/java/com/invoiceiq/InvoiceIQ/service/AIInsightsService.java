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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIInsightsService {

    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private RestClient restClient;

    @PostConstruct
    public void initializeRestClient() {

        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .defaultHeader(
                        "x-goog-api-key",
                        apiKey
                )
                .defaultHeader(
                        "Content-Type",
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();
    }

    public AIInsightsResponseDTO generateInsights(
            List<Invoice> invoices
    ) {

        try {

            if (invoices == null || invoices.isEmpty()) {

                return new AIInsightsResponseDTO(
                        "No invoice data is available yet.",
                        List.of(),
                        List.of(
                                "Upload more invoices to generate meaningful spending insights."
                        ),
                        "N/A",
                        "N/A",
                        0,
                        0,
                        0
                );
            }

            String invoiceData =
                    buildInvoiceData(invoices);

            String prompt = """
                    You are an AI financial insights assistant
                    for InvoiceIQ, an invoice intelligence platform
                    used by small businesses.

                    Analyze the provided invoice data and generate
                    useful business spending insights.

                    IMPORTANT RULES:

                    1. Use ONLY the information provided.
                    2. Never invent financial data.
                    3. Do not provide investment, tax, legal,
                       or accounting advice.
                    4. Identify meaningful spending patterns.
                    5. Identify the highest spending category.
                    6. Identify the vendor with the highest total
                       spending.
                    7. Give practical recommendations based only
                       on the available invoice data.
                    8. Keep insights concise and easy for a
                       small-business owner to understand.
                    9. Return ONLY valid JSON.
                    10. Monetary values must be in INR.

                    Return:
                    - A short overall spending summary.
                    - 3 to 5 spending insights.
                    - 3 practical recommendations.
                    - Top spending category.
                    - Top vendor.
                    - Total spending.
                    - Monthly spending.
                    - Total invoice count.

                    INVOICE DATA:
                    %s
                    """.formatted(invoiceData);

            Map<String, Object> requestBody =
                    new HashMap<>();

            Map<String, Object> part =
                    Map.of("text", prompt);

            Map<String, Object> content =
                    Map.of(
                            "parts",
                            List.of(part)
                    );

            requestBody.put(
                    "contents",
                    List.of(content)
            );

            Map<String, Object> generationConfig =
                    new HashMap<>();

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

            Map response = restClient.post()
                    .uri(
                            "/v1beta/models/"
                                    + model
                                    + ":generateContent"
                    )
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            JsonNode responseNode =
                    objectMapper.valueToTree(response);

            String jsonText =
                    extractResponseText(responseNode);

            AIInsightsResponseDTO result =
                    objectMapper.readValue(
                            jsonText,
                            AIInsightsResponseDTO.class
                    );

            System.out.println("GEMINI INSIGHTS JSON:");
            System.out.println(jsonText);

            return result;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate AI spending insights",
                    e
            );
        }
    }

    private String buildInvoiceData(
            List<Invoice> invoices
    ) {

        StringBuilder data =
                new StringBuilder();

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

        JsonNode candidates =
                response.path("candidates");

        if (!candidates.isArray()
                || candidates.isEmpty()) {

            throw new RuntimeException(
                    "Gemini did not return any candidates"
            );
        }

        JsonNode parts =
                candidates
                        .get(0)
                        .path("content")
                        .path("parts");

        for (JsonNode part : parts) {

            JsonNode text =
                    part.get("text");

            if (text != null) {
                return text.asText();
            }
        }

        throw new RuntimeException(
                "Gemini response did not contain text"
        );
    }

    private Map<String, Object> createInsightsSchema() {

        Map<String, Object> schema =
                new HashMap<>();

        schema.put("type", "OBJECT");

        Map<String, Object> properties =
                new HashMap<>();

        properties.put(
                "summary",
                Map.of("type", "STRING")
        );

        properties.put(
                "spendingInsights",
                Map.of(
                        "type", "ARRAY",
                        "items",
                        Map.of("type", "STRING")
                )
        );

        properties.put(
                "recommendations",
                Map.of(
                        "type", "ARRAY",
                        "items",
                        Map.of("type", "STRING")
                )
        );

        properties.put(
                "topCategory",
                Map.of("type", "STRING")
        );

        properties.put(
                "topVendor",
                Map.of("type", "STRING")
        );

        properties.put(
                "totalSpending",
                Map.of("type", "NUMBER")
        );

        properties.put(
                "monthlySpending",
                Map.of("type", "NUMBER")
        );

        properties.put(
                "totalInvoices",
                Map.of("type", "INTEGER")
        );

        schema.put(
                "properties",
                properties
        );

        schema.put(
                "required",
                List.of(
                        "summary",
                        "spendingInsights",
                        "recommendations",
                        "topCategory",
                        "topVendor",
                        "totalSpending",
                        "monthlySpending",
                        "totalInvoices"
                )
        );

        return schema;
    }
}
