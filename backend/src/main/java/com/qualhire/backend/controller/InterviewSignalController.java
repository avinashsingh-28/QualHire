package com.qualhire.backend.controller;

import com.qualhire.backend.dto.InterviewSignalDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class InterviewSignalController {

    private final SimpMessagingTemplate messagingTemplate;

    public InterviewSignalController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/interview.signal")
    public void processSignal(@Payload InterviewSignalDto signal) {
        // Broadcast the WebRTC signal or room action to subscribers of the interview room
        messagingTemplate.convertAndSend("/topic/interview/" + signal.getRoomCode(), signal);
    }
}
