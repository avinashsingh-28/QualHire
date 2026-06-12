package com.qualhire.backend.service;

import com.qualhire.backend.dto.ChatDto.*;
import com.qualhire.backend.model.*;
import com.qualhire.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final AttachmentRepository attachmentRepository;
    private final UserChatStatusRepository userChatStatusRepository;
    private final UserRepository userRepository;
    
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public ChatService(
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            AttachmentRepository attachmentRepository,
            UserChatStatusRepository userChatStatusRepository,
            UserRepository userRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.attachmentRepository = attachmentRepository;
        this.userChatStatusRepository = userChatStatusRepository;
        this.userRepository = userRepository;

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public Conversation getOrCreateConversation(User u1, User u2) {
        Optional<Conversation> existing = conversationRepository.findConversationBetweenUsers(u1, u2);
        if (existing.isPresent()) {
            return existing.get();
        }
        Conversation conv = new Conversation(u1, u2);
        Conversation saved = conversationRepository.save(conv);

        // Initialize user chat statuses
        userChatStatusRepository.save(new UserChatStatus(u1, saved));
        userChatStatusRepository.save(new UserChatStatus(u2, saved));

        return saved;
    }

    public List<ConversationDto> getConversationsForUser(User user) {
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + user.getId()));
        List<Conversation> convs = conversationRepository.findByUser1OrUser2(managedUser, managedUser);
        List<ConversationDto> dtos = new ArrayList<>();

        for (Conversation c : convs) {
            UserChatStatus status = userChatStatusRepository.findByUserAndConversation(managedUser, c)
                    .orElseGet(() -> userChatStatusRepository.save(new UserChatStatus(managedUser, c)));

            if (status.isDeleted()) {
                continue;
            }

            User partner = c.getUser1().getId().equals(user.getId()) ? c.getUser2() : c.getUser1();

            Message lastMsg = messageRepository.findFirstByConversationOrderByTimestampDesc(c);

            // Hide last message if it was before the chat was cleared
            if (lastMsg != null && status.getClearedAt() != null && lastMsg.getTimestamp().isBefore(status.getClearedAt())) {
                lastMsg = null;
            }

            long unreadCount = messageRepository.countUnreadMessages(c, partner, status.getClearedAt());

            ConversationDto dto = new ConversationDto();
            dto.setId(getChatId(c));
            dto.setPartnerId(partner.getId());
            dto.setName(partner.getName() + (partner.getRole().equals("candidate") ? "" : " (" + partner.getRole().substring(0, 1).toUpperCase() + partner.getRole().substring(1) + ")"));
            
            // Set company / title context
            String company = "Job Seeker";
            if (partner.getRole().equals("recruiter")) {
                company = "TechCorp Inc.";
            } else if (partner.getRole().equals("mentor")) {
                company = "Technical Mentor";
            } else if (partner.getRole().equals("admin")) {
                company = "Administrator";
            }
            dto.setCompany(company);
            dto.setAvatar(partner.getAvatar() != null ? partner.getAvatar() : partner.getName().substring(0, 1).toUpperCase());
            dto.setOnline(true); // Default to online for active chat demo
            dto.setUnread(unreadCount);
            dto.setRoleContext(partner.getRole().equals("candidate") ? "Software Engineer" : partner.getRole().equals("recruiter") ? "Senior Recruiter" : "Consulting Partner");
            dto.setMuted(status.isMuted());
            dto.setArchived(status.isArchived());
            dto.setBlocked(status.isBlocked());

            if (lastMsg != null) {
                dto.setLastMessage(mapToMessageDto(lastMsg, user));
            }

            dtos.add(dto);
        }

        return dtos;
    }

    public List<MessageDto> getMessagesForConversation(User user, String chatId) {
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + user.getId()));
        Conversation conversation = getConversationFromChatId(managedUser, chatId);

        UserChatStatus status = userChatStatusRepository.findByUserAndConversation(managedUser, conversation)
                .orElseGet(() -> userChatStatusRepository.save(new UserChatStatus(managedUser, conversation)));

        List<Message> messages;
        if (status.getClearedAt() != null) {
            messages = messageRepository.findMessagesSince(conversation, status.getClearedAt());
        } else {
            messages = messageRepository.findByConversationOrderByTimestampAsc(conversation);
        }

        // Mark messages from other user as read
        User partner = conversation.getUser1().getId().equals(user.getId()) ? conversation.getUser2() : conversation.getUser1();
        for (Message m : messages) {
            if (m.getSender().getId().equals(partner.getId()) && !"read".equals(m.getStatus())) {
                m.setStatus("read");
                messageRepository.save(m);
            }
        }

        return messages.stream().map(m -> mapToMessageDto(m, user)).toList();
    }

    public MessageDto saveMessage(User sender, String chatId, MessageDto request) {
        User managedSender = userRepository.findById(sender.getId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + sender.getId()));
        Conversation conversation = getConversationFromChatId(managedSender, chatId);

        // Check if blocked
        User partner = conversation.getUser1().getId().equals(managedSender.getId()) ? conversation.getUser2() : conversation.getUser1();
        UserChatStatus partnerStatus = userChatStatusRepository.findByUserAndConversation(partner, conversation)
                .orElseGet(() -> userChatStatusRepository.save(new UserChatStatus(partner, conversation)));
        
        if (partnerStatus.isBlocked()) {
            throw new RuntimeException("You have been blocked by this user");
        }

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(managedSender);
        message.setText(request.getText());
        message.setType(request.getType() != null ? request.getType() : "CHAT");
        message.setTimestamp(LocalDateTime.now());
        message.setStatus("sent");

        // Associate attachments if any
        if (request.getAttachments() != null && !request.getAttachments().isEmpty()) {
            for (AttachmentDto adto : request.getAttachments()) {
                Optional<Attachment> optAttachment = attachmentRepository.findById(adto.getId());
                if (optAttachment.isPresent()) {
                    Attachment attachment = optAttachment.get();
                    message.addAttachment(attachment);
                }
            }
        }

        Message saved = messageRepository.save(message);

        // Make sure partner's deleted and cleared status resets if they receive a new message
        if (partnerStatus.isDeleted()) {
            partnerStatus.setDeleted(false);
            userChatStatusRepository.save(partnerStatus);
        }

        return mapToMessageDto(saved, managedSender);
    }

    public void executeChatAction(User user, String chatId, String action, boolean value) {
        System.out.println("[ChatService] Executing action: " + action + ", value: " + value + ", user: " + user.getEmail() + ", chatId: " + chatId);
        if (action == null) {
            throw new IllegalArgumentException("Action cannot be null");
        }
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + user.getId()));
        Conversation conversation = getConversationFromChatId(managedUser, chatId);
        UserChatStatus status = userChatStatusRepository.findByUserAndConversation(managedUser, conversation)
                .orElseGet(() -> userChatStatusRepository.save(new UserChatStatus(managedUser, conversation)));

        switch (action.toLowerCase()) {
            case "mute" -> status.setMuted(value);
            case "archive" -> status.setArchived(value);
            case "delete" -> status.setDeleted(value);
            case "clear" -> status.setClearedAt(LocalDateTime.now());
            case "block" -> status.setBlocked(value);
            default -> throw new IllegalArgumentException("Unknown action: " + action);
        }
        userChatStatusRepository.save(status);
    }

    public Attachment storeFile(MultipartFile file) {
        // Normalize file name
        String originalFileName = file.getOriginalFilename();
        String cleanFileName = originalFileName != null ? originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_") : "file";
        String fileName = UUID.randomUUID().toString() + "_" + cleanFileName;

        try {
            // Check if name has invalid characters
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Attachment attachment = new Attachment();
            attachment.setFileName(originalFileName);
            attachment.setFileType(file.getContentType());
            attachment.setFilePath(targetLocation.toString());
            attachment.setFileSize(file.getSize());

            return attachmentRepository.save(attachment);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public Attachment getAttachment(Long id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id " + id));
    }

    public UserDetailsDto getUserDetails(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
        UserDetailsDto dto = new UserDetailsDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().equals("candidate") ? "Candidate" : user.getRole().equals("recruiter") ? "Recruiter" : "Mentor");
        dto.setAvatar(user.getAvatar() != null ? user.getAvatar() : user.getName().substring(0, 1).toUpperCase());
        dto.setBio(user.getBio());
        dto.setLocation(user.getLocation());
        dto.setLastActive(user.getLastActive() != null ? user.getLastActive() : "Active Now");
        return dto;
    }

    public List<UserDetailsDto> searchEligibleUsers(User currentUser, String query) {
        List<User> allUsers = userRepository.findAll();
        List<UserDetailsDto> filtered = new ArrayList<>();

        for (User u : allUsers) {
            if (u.getId().equals(currentUser.getId())) {
                continue;
            }

            // Keyword filtering
            if (query != null && !query.isEmpty()) {
                String q = query.toLowerCase();
                boolean matches = u.getName().toLowerCase().contains(q) || u.getEmail().toLowerCase().contains(q);
                if (!matches) {
                    continue;
                }
            }

            UserDetailsDto dto = new UserDetailsDto();
            dto.setId(u.getId());
            dto.setName(u.getName());
            dto.setEmail(u.getEmail());
            
            String rawRole = u.getRole();
            String roleFormatted = rawRole != null && !rawRole.isEmpty()
                    ? rawRole.substring(0, 1).toUpperCase() + rawRole.substring(1).toLowerCase()
                    : "User";
            dto.setRole(roleFormatted);
            
            dto.setAvatar(u.getAvatar() != null ? u.getAvatar() : u.getName().substring(0, 1).toUpperCase());
            dto.setBio(u.getBio());
            dto.setLocation(u.getLocation());
            dto.setLastActive(u.getLastActive() != null ? u.getLastActive() : "Active Now");
            filtered.add(dto);
        }

        return filtered;
    }

    private Conversation getConversationFromChatId(User user, String chatId) {
        String[] parts = chatId.split("_");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid chatId format: " + chatId);
        }
        Long id1 = Long.parseLong(parts[0]);
        Long id2 = Long.parseLong(parts[1]);

        if (!id1.equals(user.getId()) && !id2.equals(user.getId())) {
            throw new SecurityException("You are not authorized to access this conversation");
        }

        Long partnerId = id1.equals(user.getId()) ? id2 : id1;
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found in conversation"));

        return getOrCreateConversation(user, partner);
    }

    private String getChatId(Conversation c) {
        Long id1 = c.getUser1().getId();
        Long id2 = c.getUser2().getId();
        return id1 < id2 ? id1 + "_" + id2 : id2 + "_" + id1;
    }

    public MessageDto mapToMessageDto(Message m, User currentUser) {
        MessageDto dto = new MessageDto();
        dto.setId(m.getId());
        dto.setChatId(getChatId(m.getConversation()));
        dto.setSender(m.getSender().getId().equals(currentUser.getId()) ? "me" : "them");
        dto.setSenderId(m.getSender().getId());
        dto.setText(m.getText());
        dto.setTime(m.getTimestamp().format(DateTimeFormatter.ofPattern("hh:mm a")));
        dto.setStatus(m.getStatus());
        dto.setType(m.getType());

        if (m.getAttachments() != null && !m.getAttachments().isEmpty()) {
            List<AttachmentDto> attachmentDtos = m.getAttachments().stream().map(a -> {
                AttachmentDto adto = new AttachmentDto();
                adto.setId(a.getId());
                adto.setFileName(a.getFileName());
                adto.setFileType(a.getFileType());
                adto.setFileSize(a.getFileSize());
                adto.setFileUrl("/api/v1/chat/attachments/download/" + a.getId());
                return adto;
            }).toList();
            dto.setAttachments(attachmentDtos);
        }

        return dto;
    }
}
