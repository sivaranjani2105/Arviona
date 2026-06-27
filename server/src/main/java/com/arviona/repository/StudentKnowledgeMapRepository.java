package com.arviona.repository;

import com.arviona.model.StudentKnowledgeMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentKnowledgeMapRepository extends JpaRepository<StudentKnowledgeMap, String> {

    @Query("SELECT k FROM StudentKnowledgeMap k WHERE k.student.id = :studentId AND k.deleted = false")
    List<StudentKnowledgeMap> findAllByStudentIdAndDeletedFalse(@Param("studentId") String studentId);

    @Query("SELECT k FROM StudentKnowledgeMap k WHERE k.student.id = :studentId AND k.subject = :subject AND k.deleted = false")
    Optional<StudentKnowledgeMap> findByStudentIdAndSubjectAndDeletedFalse(
            @Param("studentId") String studentId, @Param("subject") String subject);

    @Query("SELECT k FROM StudentKnowledgeMap k WHERE k.student.id = :studentId AND k.subject = :subject AND k.topic = :topic AND k.subtopic = :subtopic AND k.deleted = false")
    Optional<StudentKnowledgeMap> findByStudentIdAndSubjectAndTopicAndSubtopicAndDeletedFalse(
            @Param("studentId") String studentId, @Param("subject") String subject,
            @Param("topic") String topic, @Param("subtopic") String subtopic);
}
