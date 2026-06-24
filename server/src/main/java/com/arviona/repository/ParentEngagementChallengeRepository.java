package com.arviona.repository;

import com.arviona.model.ParentEngagementChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ParentEngagementChallengeRepository extends JpaRepository<ParentEngagementChallenge, String> {
    List<ParentEngagementChallenge> findAllByStudentIdAndDeletedFalse(String studentId);
    List<ParentEngagementChallenge> findAllByParentIdAndDeletedFalse(String parentId);
}
