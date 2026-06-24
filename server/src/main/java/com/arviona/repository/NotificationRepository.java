package com.arviona.repository;

import com.arviona.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(String userId);
    List<Notification> findByUserIdAndReadStatusFalseAndDeletedFalseOrderByCreatedAtDesc(String userId);
}
