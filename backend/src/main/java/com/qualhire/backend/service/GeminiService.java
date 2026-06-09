package com.qualhire.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key:your_gemini_api_key_here}")
    private String geminiApiKey;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String analyzeResume(String resumeText, String targetRole) {
        String prompt = "You are an expert technical recruiter and ATS system. " +
                "Analyze the following resume for the role of '" + targetRole + "'. " +
                "Return your analysis STRICTLY as a JSON object matching this structure EXACTLY: \n" +
                "{\n" +
                "  \"atsScore\": 88,\n" +
                "  \"industryMatch\": 92,\n" +
                "  \"readability\": 85,\n" +
                "  \"keywordOptimization\": 78,\n" +
                "  \"skills\": [{ \"name\": \"React\", \"match\": 100 }],\n" +
                "  \"missingSkills\": [\"GraphQL\"],\n" +
                "  \"structure\": {\"metricsUsed\": \"45%\", \"actionVerbs\": \"High\", \"fluffWords\": \"Low\", \"length\": \"Optimal\"},\n" +
                "  \"suggestions\": [{ \"type\": \"critical|warning|success\", \"text\": \"...\" }]\n" +
                "}\n\n" +
                "Do NOT wrap the response in markdown blocks (e.g., ```json). Return ONLY the raw JSON string.\n\n" +
                "Resume Text:\n" + resumeText;

        try {
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            
            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(content));

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GEMINI_URL + "?key=" + geminiApiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // Parse the Gemini response
                JsonNode rootNode = objectMapper.readTree(response.body());
                JsonNode candidatesNode = rootNode.path("candidates");
                if (candidatesNode.isArray() && candidatesNode.size() > 0) {
                    JsonNode contentNode = candidatesNode.get(0).path("content");
                    JsonNode partsNode = contentNode.path("parts");
                    if (partsNode.isArray() && partsNode.size() > 0) {
                        String textResponse = partsNode.get(0).path("text").asText();
                        // Clean up markdown formatting if Gemini still returns it
                        if (textResponse.startsWith("```json")) {
                            textResponse = textResponse.substring(7);
                        }
                        if (textResponse.startsWith("```")) {
                            textResponse = textResponse.substring(3);
                        }
                        if (textResponse.endsWith("```")) {
                            textResponse = textResponse.substring(0, textResponse.length() - 3);
                        }
                        return textResponse.trim();
                    }
                }
            } else {
                throw new RuntimeException("Failed to call Gemini API: " + response.body());
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error communicating with Gemini: " + e.getMessage());
        }
        
        throw new RuntimeException("Failed to extract content from Gemini response");
    }
}
