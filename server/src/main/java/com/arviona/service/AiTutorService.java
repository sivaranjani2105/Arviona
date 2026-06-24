package com.arviona.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class AiTutorService {
    private static final Logger logger = LoggerFactory.getLogger(AiTutorService.class);

    @Value("${arviona.gemini.api-key:}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateContent(String systemInstruction, List<Map<String, String>> chatHistory, String userMessage) {
        // Fallback if API key is not configured
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            logger.warn("Gemini API key is not configured. Returning fallback response.");
            return "Hello! I am your AI study assistant. (To enable real AI responses, please configure 'arviona.gemini.api-key' in your application.properties file).";
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct payload contents
            List<Map<String, Object>> contents = new ArrayList<>();
            
            // Add history
            for (Map<String, String> msg : chatHistory) {
                String role = msg.get("role");
                // Gemini API expects 'user' or 'model' roles
                if ("assistant".equalsIgnoreCase(role)) {
                    role = "model";
                }
                
                contents.add(Map.of(
                    "role", role.toLowerCase(),
                    "parts", List.of(Map.of("text", msg.get("text")))
                ));
            }
            
            // Add latest message
            contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", userMessage))
            ));

            // Construct full request payload
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", contents);

            if (systemInstruction != null && !systemInstruction.trim().isEmpty()) {
                requestBody.put("systemInstruction", Map.of(
                    "parts", List.of(Map.of("text", systemInstruction))
                ));
            }

            requestBody.put("generationConfig", Map.of(
                "temperature", 0.7
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, entity, String.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                JsonNode rootNode = objectMapper.readTree(responseEntity.getBody());
                JsonNode textNode = rootNode
                        .path("candidates").get(0)
                        .path("content")
                        .path("parts").get(0)
                        .path("text");
                return textNode.asText();
            } else {
                logger.error("Error response from Gemini API: {}", responseEntity.getStatusCode());
                return "I ran into a connection issue with my brain-ship. Let's try that again in a moment! 🚀";
            }
        } catch (Exception e) {
            logger.error("Failed to generate content from Gemini API", e);
            return "Oops! I encountered an error while trying to process your request. Let's try again! 🤖";
        }
    }
}
