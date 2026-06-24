package com.arviona.controller;

import com.arviona.exception.BadRequestException;
import com.arviona.model.*;
import com.arviona.repository.*;
import com.arviona.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Conversation> conversations = conversationRepository.findByUserIdAndDeletedFalse(userDetails.getId());
        
        List<Map<String, Object>> response = conversations.stream().map(c -> {
            List<Map<String, String>> participants = c.getParticipants().stream()
                    .map(p -> Map.of("id", p.getId(), "name", p.getName(), "email", p.getEmail()))
                    .collect(Collectors.toList());

            Map<String, Object> convMap = new HashMap<>();
            convMap.put("id", c.getId());
            convMap.put("name", c.getName() != null ? c.getName() : "");
            convMap.put("participants", participants);
            return convMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<?> getMessages(
            @PathVariable("id") String conversationId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new BadRequestException("Conversation not found"));

        // Verify participant
        boolean isParticipant = conversation.getParticipants().stream()
                .anyMatch(p -> p.getId().equals(userDetails.getId()));
        if (!isParticipant) {
            throw new BadRequestException("You are not a participant in this conversation!");
        }

        List<Message> messages = messageRepository.findByConversationIdAndDeletedFalseOrderByCreatedAtAsc(conversationId);
        
        List<Map<String, Object>> response = messages.stream().map(m -> {
            Map<String, Object> msgMap = new HashMap<>();
            msgMap.put("id", m.getId());
            msgMap.put("senderId", m.getSender().getId());
            msgMap.put("senderName", m.getSender().getName());
            msgMap.put("message", m.getMessage());
            msgMap.put("createdAt", m.getCreatedAt().toString());
            return msgMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/conversations")
    public ResponseEntity<?> createConversation(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, String> payload) {
        
        String recipientId = payload.get("recipientId");
        String name = payload.get("name");

        User currentUser = userRepository.findById(userDetails.getId()).orElseThrow();
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new BadRequestException("Recipient user not found"));

        Conversation conversation = Conversation.builder()
                .id(UUID.randomUUID().toString())
                .name(name != null ? name : recipient.getName())
                .participants(new HashSet<>(Arrays.asList(currentUser, recipient)))
                .createdBy(currentUser.getName())
                .build();

        conversationRepository.save(conversation);
        return ResponseEntity.ok(conversation);
    }

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable("id") String conversationId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, String> payload) {
        
        String messageText = payload.get("message");

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new BadRequestException("Conversation not found"));

        // Verify participant
        boolean isParticipant = conversation.getParticipants().stream()
                .anyMatch(p -> p.getId().equals(userDetails.getId()));
        if (!isParticipant) {
            throw new BadRequestException("You are not a participant in this conversation!");
        }

        User sender = userRepository.findById(userDetails.getId()).orElseThrow();

        Message message = Message.builder()
                .id(UUID.randomUUID().toString())
                .conversation(conversation)
                .sender(sender)
                .message(messageText)
                .createdBy(sender.getName())
                .build();

        messageRepository.save(message);
        return ResponseEntity.ok(message);
    }
}
