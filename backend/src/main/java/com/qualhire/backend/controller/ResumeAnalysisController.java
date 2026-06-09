package com.qualhire.backend.controller;

import com.qualhire.backend.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeAnalysisController {

    private final GeminiService geminiService;

    public ResumeAnalysisController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<String> analyzeResume(@RequestBody Map<String, String> payload) {
        String resumeText = payload.get("resumeText");
        String targetRole = payload.get("targetRole");

        if (resumeText == null || resumeText.isEmpty() || targetRole == null || targetRole.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"resumeText and targetRole are required\"}");
        }

        try {
            String analysisJson = geminiService.analyzeResume(resumeText, targetRole);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(analysisJson);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
