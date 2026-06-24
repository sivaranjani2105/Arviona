package com.arviona.repository;

import com.arviona.model.QuestSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuestSubmissionRepository extends JpaRepository<QuestSubmission, String> {
    Optional<QuestSubmission> findByQuestIdAndStudentIdAndDeletedFalse(String questId, String studentId);
    List<QuestSubmission> findAllByStudentIdAndDeletedFalse(String studentId);
    List<QuestSubmission> findAllByQuestIdAndDeletedFalse(String questId);
}
