package com.qualhire.backend.controller;

import com.qualhire.backend.dto.ChatDto.MessageDto;
import com.qualhire.backend.model.User;
import com.qualhire.backend.repository.UserRepository;
import com.qualhire.backend.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final UserRepository userRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService, UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageDto messageDto) {
        if ("TYPING".equals(messageDto.getType())) {
            // Typing events are transient, broadcast immediately without saving
            messagingTemplate.convertAndSend("/topic/messages/" + messageDto.getChatId(), messageDto);
            return;
        }

        try {
            Long senderId = messageDto.getSenderId();
            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new RuntimeException("Sender not found: " + senderId));

            // Save to Database
            MessageDto saved = chatService.saveMessage(sender, messageDto.getChatId(), messageDto);

            // Broadcast the saved message with DB ID and correct timestamp to subscribers
            messagingTemplate.convertAndSend("/topic/messages/" + messageDto.getChatId(), saved);
        } catch (Exception e) {
            System.err.println("Error processing WebSocket message: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
