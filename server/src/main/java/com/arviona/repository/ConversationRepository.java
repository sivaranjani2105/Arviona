package com.arviona.repository;

import com.arviona.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {
    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p.id = :userId AND c.deleted = false")
    List<Conversation> findByUserIdAndDeletedFalse(@Param("userId") String userId);
}
