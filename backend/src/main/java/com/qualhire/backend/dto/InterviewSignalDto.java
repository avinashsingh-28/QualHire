package com.qualhire.backend.dto;

public class InterviewSignalDto {
    private String type; // e.g. JOIN, LEAVE, OFFER, ANSWER, ICE_CANDIDATE, MEDIA_TOGGLE, RECORDING, RAISE_HAND, MUTE_ALL, MUTE_USER
    private String roomCode;
    private Long senderId;
    private String senderName;
    private Object data; // SDP data, ICE candidate string, or status fields

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}
