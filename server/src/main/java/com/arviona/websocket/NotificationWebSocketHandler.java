package com.arviona.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.io.IOException;
import java.net.URI;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class NotificationWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(NotificationWebSocketHandler.class);
    
    // Maps userId -> List of active WebSocket sessions
    private final Map<String, List<WebSocketSession>> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = getUserIdFromSession(session);
        if (userId != null) {
            userSessions.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(session);
            logger.info("WebSocket connection established for user: {} (Session ID: {})", userId, session.getId());
        } else {
            logger.warn("WebSocket connection rejected: No userId query parameter found (Session ID: {})", session.getId());
            session.close(CloseStatus.BAD_DATA);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String userId = getUserIdFromSession(session);
        if (userId != null && userSessions.containsKey(userId)) {
            userSessions.get(userId).remove(session);
            if (userSessions.get(userId).isEmpty()) {
                userSessions.remove(userId);
            }
            logger.info("WebSocket connection closed for user: {} (Session ID: {})", userId, session.getId());
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Heartbeats or ping-pong if requested, otherwise ignore client uploads for clean push-only architecture
    }

    /**
     * Sends a real-time notification payload to all open sessions of a specific user.
     */
    public boolean sendNotification(String userId, String jsonPayload) {
        List<WebSocketSession> sessions = userSessions.get(userId);
        if (sessions == null || sessions.isEmpty()) {
            return false;
        }

        logger.info("Broadcasting real-time notification to user: {} (Active open sessions: {})", userId, sessions.size());
        boolean delivered = false;
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(jsonPayload));
                    delivered = true;
                } catch (IOException e) {
                    logger.error("Failed to send WebSocket message on session: {}", session.getId(), e);
                }
            }
        }
        return delivered;
    }

    private String getUserIdFromSession(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri == null) return null;
        
        String query = uri.getQuery();
        if (query == null) return null;
        
        // Match userId=VALUE
        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length == 2 && "userId".equalsIgnoreCase(pair[0])) {
                return pair[1];
            }
        }
        return null;
    }
}
