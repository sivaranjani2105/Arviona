package com.arviona.repository;

import com.arviona.model.StudentKnowledgeMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentKnowledgeMapRepository extends JpaRepository<StudentKnowledgeMap, String> {
    List<StudentKnowledgeMap> findAllByStudentIdAndDeletedFalse(String studentId);
    Optional<StudentKnowledgeMap> findByStudentIdAndSubjectAndDeletedFalse(String studentId, String subject);
    Optional<StudentKnowledgeMap> findByStudentIdAndSubjectAndTopicAndSubtopicAndDeletedFalse(
            String studentId, String subject, String topic, String subtopic);
}
