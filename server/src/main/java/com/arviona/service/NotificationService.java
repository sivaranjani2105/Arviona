package com.arviona.service;

import com.arviona.model.Notification;
import com.arviona.repository.NotificationRepository;
import com.arviona.websocket.NotificationWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationWebSocketHandler webSocketHandler;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Notification saveAndSend(Notification notif) {
        Notification saved = notificationRepository.save(notif);
        
        try {
            // Build simple payload map to serialize to JSON
            java.util.Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("id", saved.getId());
            payload.put("title", saved.getTitle());
            payload.put("message", saved.getMessage());
            payload.put("type", saved.getType());
            payload.put("read", saved.isReadStatus());
            
            String json = objectMapper.writeValueAsString(payload);
            String userId = saved.getUser() != null ? saved.getUser().getId() : saved.getUserId();
            
            if (userId != null) {
                webSocketHandler.sendNotification(userId, json);
            }
        } catch (Exception e) {
            logger.error("Failed to serialize or send real-time WebSocket notification", e);
        }
        
        return saved;
    }
}
