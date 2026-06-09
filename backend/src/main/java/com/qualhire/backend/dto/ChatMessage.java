package com.qualhire.backend.dto;

public class ChatMessage {
    private String id;
    private String chatId;
    private String senderId;
    private String text;
    private String time;
    private String status;
    private MessageType type;

    public enum MessageType {
        CHAT,
        TYPING,
        JOIN,
        LEAVE
    }

    public ChatMessage() {
    }

    public ChatMessage(String id, String chatId, String senderId, String text, String time, String status, MessageType type) {
        this.id = id;
        this.chatId = chatId;
        this.senderId = senderId;
        this.text = text;
        this.time = time;
        this.status = status;
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }
}
