package com.arviona.repository;

import com.arviona.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {
    List<Message> findByConversationIdAndDeletedFalseOrderByCreatedAtAsc(String conversationId);
}
