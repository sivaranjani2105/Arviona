package com.arviona.controller;

import com.arviona.model.Notification;
import com.arviona.repository.NotificationRepository;
import com.arviona.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Notification> list = notificationRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userDetails.getId());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/mark-read")
    public ResponseEntity<?> markAsRead(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Notification> list = notificationRepository.findByUserIdAndReadStatusFalseAndDeletedFalseOrderByCreatedAtDesc(userDetails.getId());
        for (Notification notification : list) {
            notification.setReadStatus(true);
        }
        notificationRepository.saveAll(list);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }
}
