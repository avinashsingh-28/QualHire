package com.qualhire.backend.dto;

import java.util.List;

public class ChatDto {

    public static class ConversationDto {
        private String id;
        private Long partnerId;
        private String name;
        private String company;
        private String avatar;
        private boolean isOnline;
        private long unread;
        private String roleContext;
        private boolean isMuted;
        private boolean isArchived;
        private MessageDto lastMessage;

        public ConversationDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public Long getPartnerId() { return partnerId; }
        public void setPartnerId(Long partnerId) { this.partnerId = partnerId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }

        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }

        public boolean isOnline() { return isOnline; }
        public void setOnline(boolean online) { isOnline = online; }

        public long getUnread() { return unread; }
        public void setUnread(long unread) { this.unread = unread; }

        public String getRoleContext() { return roleContext; }
        public void setRoleContext(String roleContext) { this.roleContext = roleContext; }

        public boolean isMuted() { return isMuted; }
        public void setMuted(boolean muted) { isMuted = muted; }

        public boolean isArchived() { return isArchived; }
        public void setArchived(boolean archived) { isArchived = archived; }

        public MessageDto getLastMessage() { return lastMessage; }
        public void setLastMessage(MessageDto lastMessage) { this.lastMessage = lastMessage; }
    }

    public static class MessageDto {
        private Long id;
        private String chatId;
        private String sender; // "me" or "them"
        private Long senderId;
        private String text;
        private String time;
        private String status;
        private String type; // CHAT, EMOJI, STICKER, ATTACHMENT
        private List<AttachmentDto> attachments;

        public MessageDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getChatId() { return chatId; }
        public void setChatId(String chatId) { this.chatId = chatId; }

        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }

        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public List<AttachmentDto> getAttachments() { return attachments; }
        public void setAttachments(List<AttachmentDto> attachments) { this.attachments = attachments; }
    }

    public static class AttachmentDto {
        private Long id;
        private String fileName;
        private String fileType;
        private Long fileSize;
        private String fileUrl;

        public AttachmentDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }

        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }

        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    }

    public static class UserDetailsDto {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String avatar;
        private String bio;
        private String location;
        private String lastActive;

        public UserDetailsDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }

        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getLastActive() { return lastActive; }
        public void setLastActive(String lastActive) { this.lastActive = lastActive; }
    }

    public static class ChatActionRequest {
        private String action; // archive, mute, clear, delete, block
        private boolean value;

        public ChatActionRequest() {}

        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }

        public boolean isValue() { return value; }
        public void setValue(boolean value) { this.value = value; }
    }
}
