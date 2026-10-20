package com.invoiceiq.InvoiceIQ.service;

import com.invoiceiq.InvoiceIQ.dto.ExtractedInvoiceDTO;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIExtractionService {

    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-3.5-flash-lite}")
    private String model;

    /**
     * Set GEMINI_ENABLED=true to enable actual Gemini API calls.
     * If unset or false, mock mode is enabled.
     */
    @Value("${gemini.enabled:false}")
    private boolean geminiEnabled;

    private RestClient restClient;

    @PostConstruct
    public void initializeRestClient() {

        if (!geminiEnabled) {
            System.out.println(
                    "Gemini is disabled. Mock invoice extraction is enabled."
            );
            return;
        }

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "GEMINI_ENABLED=true, but GEMINI_API_KEY is not configured."
            );
        }

        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .defaultHeader("x-goog-api-key", apiKey)
                .defaultHeader(
                        "Content-Type",
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();

        System.out.println("Gemini API integration is enabled.");
    }

    /**
     * Extracts invoice information.
     *
     * Mock mode:
     * Returns fixed test data without calling Gemini.
     *
     * Real mode:
     * Sends OCR text to Gemini and converts its JSON response
     * into ExtractedInvoiceDTO.
     */
    public ExtractedInvoiceDTO extractInvoiceData(String rawText) {

        if (!geminiEnabled) {
            return createMockInvoiceData();
        }

        if (rawText == null || rawText.isBlank()) {
            throw new IllegalArgumentException(
                    "OCR text cannot be empty."
            );
        }

        try {

            String prompt = """
                    You are an invoice data extraction system.

                    Extract invoice information from the OCR text below.

                    Rules:
                    - Extract only information actually present in the text.
                    - Never invent or guess information.
                    - If a field is unavailable, return null.
                    - Extract all invoice items when available.
                    - Dates must use YYYY-MM-DD format.
                    - Return only valid JSON.

                    OCR TEXT:
                    %s
                    """.formatted(rawText);

            Map<String, Object> requestBody = new HashMap<>();

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
                    createInvoiceSchema()
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
                        "Gemini returned an empty response."
                );
            }

            JsonNode responseNode =
                    objectMapper.valueToTree(response);

            String jsonText =
                    extractResponseText(responseNode);

            JsonNode invoiceJson =
                    objectMapper.readTree(jsonText);

            if (invoiceJson instanceof
                    tools.jackson.databind.node.ObjectNode invoiceObject) {

                normalizeDateField(invoiceObject, "invoiceDate");
                normalizeDateField(invoiceObject, "dueDate");
            }

            ExtractedInvoiceDTO result =
                    objectMapper.treeToValue(
                            invoiceJson,
                            ExtractedInvoiceDTO.class
                    );

            // Do not log complete invoice data or extracted PII.
            System.out.println(
                    "Gemini invoice extraction completed successfully."
            );

            return result;

        } catch (Exception e) {

            // Avoid logging invoice contents, API keys, or raw responses.
            throw new RuntimeException(
                    "Failed to extract invoice data using Gemini AI.",
                    e
            );
        }
    }

    /**
     * Returns predictable test data without making an external API request.
     *
     * This is deliberately not based on the supplied OCR text.
     * The returned values must not be treated as genuine invoice data.
     */
    private ExtractedInvoiceDTO createMockInvoiceData() {

        ExtractedInvoiceDTO mock = new ExtractedInvoiceDTO();

        mock.setVendorName("TEST VENDOR");
        mock.setGstin(null);
        mock.setInvoiceNumber("TEST-INV-001");
        mock.setInvoiceDate(null);
        mock.setDueDate(null);
        mock.setItems(new ArrayList<>());
        mock.setSubtotal(0.0);
        mock.setTax(0.0);
        mock.setTotalAmount(0.0);

        System.out.println(
                "MOCK MODE: Returning test invoice data. "
                        + "Gemini API was not called."
        );

        return mock;
    }

    private String extractResponseText(JsonNode response) {

        JsonNode candidates = response.path("candidates");

        if (!candidates.isArray() || candidates.isEmpty()) {
            throw new IllegalStateException(
                    "Gemini did not return any candidates."
            );
        }

        JsonNode parts = candidates
                .get(0)
                .path("content")
                .path("parts");

        for (JsonNode part : parts) {

            JsonNode text = part.get("text");

            if (text != null && !text.isNull()) {
                return text.asText();
            }
        }

        throw new IllegalStateException(
                "Gemini response did not contain text."
        );
    }

    private void normalizeDateField(
            tools.jackson.databind.node.ObjectNode invoice,
            String fieldName
    ) {

        JsonNode dateNode = invoice.get(fieldName);

        if (dateNode == null || dateNode.isNull()) {
            invoice.putNull(fieldName);
            return;
        }

        String dateValue = dateNode.asText().trim();

        if (dateValue.isEmpty()
                || dateValue.equalsIgnoreCase("null")
                || dateValue.equalsIgnoreCase("n/a")
                || dateValue.equalsIgnoreCase("not available")) {

            invoice.putNull(fieldName);
            return;
        }

        try {
            LocalDate.parse(dateValue);
        } catch (DateTimeParseException e) {
            invoice.putNull(fieldName);
        }
    }

    private Map<String, Object> createInvoiceSchema() {

        Map<String, Object> schema = new HashMap<>();

        schema.put("type", "OBJECT");

        Map<String, Object> properties = new HashMap<>();

        properties.put(
                "vendorName",
                Map.of("type", "STRING")
        );

        properties.put(
                "gstin",
                Map.of("type", "STRING")
        );

        properties.put(
                "invoiceNumber",
                Map.of("type", "STRING")
        );

        properties.put(
                "invoiceDate",
                Map.of("type", "STRING")
        );

        properties.put(
                "dueDate",
                Map.of("type", "STRING")
        );

        Map<String, Object> itemProperties = new HashMap<>();

        itemProperties.put(
                "description",
                Map.of("type", "STRING")
        );

        itemProperties.put(
                "quantity",
                Map.of("type", "NUMBER")
        );

        itemProperties.put(
                "unitPrice",
                Map.of("type", "NUMBER")
        );

        itemProperties.put(
                "amount",
                Map.of("type", "NUMBER")
        );

        Map<String, Object> itemSchema = new HashMap<>();

        itemSchema.put("type", "OBJECT");
        itemSchema.put("properties", itemProperties);

        itemSchema.put(
                "required",
                List.of(
                        "description",
                        "quantity",
                        "unitPrice",
                        "amount"
                )
        );

        properties.put(
                "items",
                Map.of(
                        "type", "ARRAY",
                        "items", itemSchema
                )
        );

        properties.put(
                "subtotal",
                Map.of("type", "NUMBER")
        );

        properties.put(
                "tax",
                Map.of("type", "NUMBER")
        );

        properties.put(
                "totalAmount",
                Map.of("type", "NUMBER")
        );

        schema.put("properties", properties);

        schema.put(
                "required",
                List.of(
                        "vendorName",
                        "gstin",
                        "invoiceNumber",
                        "invoiceDate",
                        "dueDate",
                        "items",
                        "subtotal",
                        "tax",
                        "totalAmount"
                )
        );

        return schema;
    }
}
