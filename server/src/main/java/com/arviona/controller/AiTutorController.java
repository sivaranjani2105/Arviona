package com.arviona.controller;

import com.arviona.model.StudentKnowledgeMap;
import com.arviona.model.User;
import com.arviona.repository.StudentKnowledgeMapRepository;
import com.arviona.repository.UserRepository;
import com.arviona.security.UserDetailsImpl;
import com.arviona.service.AiTutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/v1/ai")
public class AiTutorController {

    @Autowired
    private AiTutorService aiTutorService;

    @Autowired
    private StudentKnowledgeMapRepository knowledgeMapRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {
        
        String systemInstruction = (String) payload.get("systemInstruction");
        String message = (String) payload.get("message");
        
        @SuppressWarnings("unchecked")
        List<Map<String, String>> history = (List<Map<String, String>>) payload.get("history");
        if (history == null) {
            history = new ArrayList<>();
        }

        String aiResponse = aiTutorService.generateContent(systemInstruction, history, message);
        
        // AI Knowledge Map adaptive logic updates
        if (userDetails != null && message != null) {
            String studentId = userDetails.getId();
            String msgLower = message.toLowerCase();
            
            if (msgLower.contains("derivative")) {
                updateKnowledgeMapStatus(studentId, "Mathematics", "Calculus", "Derivatives", "MASTERED", BigDecimal.valueOf(100.00));
            } else if (msgLower.contains("limit")) {
                updateKnowledgeMapStatus(studentId, "Mathematics", "Calculus", "Limits", "MASTERED", BigDecimal.valueOf(100.00));
            } else if (msgLower.contains("double slit")) {
                updateKnowledgeMapStatus(studentId, "Science", "Quantum Mechanics", "Double Slit", "MASTERED", BigDecimal.valueOf(100.00));
            }
        }
        
        return ResponseEntity.ok(Map.of("response", aiResponse));
    }

    private void updateKnowledgeMapStatus(String studentId, String subject, String topic, String subtopic, String status, BigDecimal score) {
        Optional<StudentKnowledgeMap> existing = knowledgeMapRepository
                .findByStudentIdAndSubjectAndTopicAndSubtopicAndDeletedFalse(studentId, subject, topic, subtopic);
        
        if (existing.isPresent()) {
            StudentKnowledgeMap map = existing.get();
            map.setStatus(status);
            map.setScorePercentage(score);
            knowledgeMapRepository.save(map);
        } else {
            User student = userRepository.findById(studentId).orElse(null);
            if (student != null) {
                StudentKnowledgeMap newMap = StudentKnowledgeMap.builder()
                        .id(UUID.randomUUID().toString())
                        .student(student)
                        .subject(subject)
                        .topic(topic)
                        .subtopic(subtopic)
                        .status(status)
                        .scorePercentage(score)
                        .createdBy("ai-tutor")
                        .build();
                knowledgeMapRepository.save(newMap);
            }
        }
    }
}
