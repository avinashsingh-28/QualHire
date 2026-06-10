package com.qualhire.backend.controller;

import com.qualhire.backend.dto.ChatDto.*;
import com.qualhire.backend.model.Attachment;
import com.qualhire.backend.model.User;
import com.qualhire.backend.security.UserDetailsImpl;
import com.qualhire.backend.service.ChatService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatApiController {

    private final ChatService chatService;

    public ChatApiController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userDetails.getUser();
        return ResponseEntity.ok(chatService.getConversationsForUser(user));
    }

    @GetMapping("/conversations/{chatId}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String chatId
    ) {
        User user = userDetails.getUser();
        return ResponseEntity.ok(chatService.getMessagesForConversation(user, chatId));
    }

    @PostMapping("/conversations/{chatId}/messages")
    public ResponseEntity<MessageDto> sendMessage(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String chatId,
            @RequestBody MessageDto messageDto
    ) {
        User user = userDetails.getUser();
        return ResponseEntity.ok(chatService.saveMessage(user, chatId, messageDto));
    }

    @PostMapping("/upload")
    public ResponseEntity<AttachmentDto> uploadFile(@RequestParam("file") MultipartFile file) {
        Attachment attachment = chatService.storeFile(file);
        AttachmentDto dto = new AttachmentDto();
        dto.setId(attachment.getId());
        dto.setFileName(attachment.getFileName());
        dto.setFileType(attachment.getFileType());
        dto.setFileSize(attachment.getFileSize());
        dto.setFileUrl("/api/v1/chat/attachments/download/" + attachment.getId());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/attachments/download/{id}")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long id) {
        try {
            Attachment attachment = chatService.getAttachment(id);
            Path filePath = Paths.get(attachment.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                String contentType = attachment.getFileType();
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/conversations/{chatId}/action")
    public ResponseEntity<Void> executeAction(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String chatId,
            @RequestBody ChatActionRequest request
    ) {
        User user = userDetails.getUser();
        chatService.executeChatAction(user, chatId, request.getAction(), request.isValue());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<UserDetailsDto>> searchUsers(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(value = "query", required = false) String query
    ) {
        User user = userDetails.getUser();
        return ResponseEntity.ok(chatService.searchEligibleUsers(user, query));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDetailsDto> getUserDetails(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.getUserDetails(id));
    }
}
