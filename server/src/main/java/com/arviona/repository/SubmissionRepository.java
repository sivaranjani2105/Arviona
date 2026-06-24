package com.arviona.repository;

import com.arviona.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
    Optional<Submission> findByAssignmentIdAndStudentIdAndDeletedFalse(String assignmentId, String studentId);
    List<Submission> findByStudentIdAndDeletedFalse(String studentId);
    List<Submission> findByAssignmentIdAndDeletedFalse(String assignmentId);
}
