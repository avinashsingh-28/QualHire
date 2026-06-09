package com.qualhire.backend.controller;

import com.qualhire.backend.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        // Here we receive a message sent to /app/chat.sendMessage
        // We broadcast it to everyone subscribed to /topic/messages/{chatId}
        // In a real application, you might save this to a database first
        
        // Ensure status is delivered once it reaches the server
        if (chatMessage.getType() == ChatMessage.MessageType.CHAT) {
            chatMessage.setStatus("delivered");
        }
        
        messagingTemplate.convertAndSend("/topic/messages/" + chatMessage.getChatId(), chatMessage);
    }
}
