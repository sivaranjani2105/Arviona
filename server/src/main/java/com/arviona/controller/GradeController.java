package com.arviona.controller;

import com.arviona.exception.BadRequestException;
import com.arviona.model.*;
import com.arviona.repository.*;
import com.arviona.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class GradeController {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/grades")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> createGradebookEntry(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {

        String studentId = (String) payload.get("studentId");
        String classId = (String) payload.get("classId");
        String assessmentName = (String) payload.get("assessmentName");
        Number marksNum = (Number) payload.get("marks");
        Number totalMarksNum = (Number) payload.get("totalMarks");
        String gradeStr = (String) payload.get("grade");
        String remarks = (String) payload.get("remarks");

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new BadRequestException("Student not found"));

        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new BadRequestException("Class not found"));

        BigDecimal marks = BigDecimal.valueOf(marksNum.doubleValue());
        BigDecimal totalMarks = BigDecimal.valueOf(totalMarksNum.doubleValue());

        Grade grade = Grade.builder()
                .id(UUID.randomUUID().toString())
                .student(student)
                .classEntity(classEntity)
                .assessmentName(assessmentName)
                .marks(marks)
                .totalMarks(totalMarks)
                .grade(gradeStr)
                .remarks(remarks)
                .createdBy(userDetails.getName())
                .build();

        gradeRepository.save(grade);
        return ResponseEntity.ok(grade);
    }

    @PostMapping("/submissions/{submissionId}/grade")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> gradeSubmission(
            @PathVariable("submissionId") String submissionId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {

        String gradeStr = (String) payload.get("grade");
        Integer marksObtained = (Integer) payload.get("marksObtained");
        String feedback = (String) payload.get("feedback");

        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new BadRequestException("Submission not found"));

        submission.setGrade(gradeStr);
        submission.setMarksObtained(marksObtained);
        submission.setFeedback(feedback);
        submission.setUpdatedBy(userDetails.getName());

        submissionRepository.save(submission);
        return ResponseEntity.ok(submission);
    }
}
