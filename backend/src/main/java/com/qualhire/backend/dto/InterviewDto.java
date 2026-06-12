package com.qualhire.backend.dto;

import java.time.LocalDateTime;

public class InterviewDto {

    public static class InterviewDetailsDto {
        private Long id;
        private String title;
        private String description;
        private LocalDateTime scheduledTime;
        private Integer durationMinutes;
        private String roomCode;
        private String status;
        private Long candidateId;
        private String candidateName;
        private String candidateEmail;
        private Long interviewerId;
        private String interviewerName;
        private String recordingUrl;
        private String notes;
        private LocalDateTime createdAt;
        private boolean hasEvaluation;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public LocalDateTime getScheduledTime() { return scheduledTime; }
        public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

        public Integer getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

        public String getRoomCode() { return roomCode; }
        public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Long getCandidateId() { return candidateId; }
        public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

        public String getCandidateName() { return candidateName; }
        public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

        public String getCandidateEmail() { return candidateEmail; }
        public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

        public Long getInterviewerId() { return interviewerId; }
        public void setInterviewerId(Long interviewerId) { this.interviewerId = interviewerId; }

        public String getInterviewerName() { return interviewerName; }
        public void setInterviewerName(String interviewerName) { this.interviewerName = interviewerName; }

        public String getRecordingUrl() { return recordingUrl; }
        public void setRecordingUrl(String recordingUrl) { this.recordingUrl = recordingUrl; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public boolean isHasEvaluation() { return hasEvaluation; }
        public void setHasEvaluation(boolean hasEvaluation) { this.hasEvaluation = hasEvaluation; }
    }

    public static class ScheduleInterviewRequest {
        private String title;
        private String description;
        private String scheduledTime;
        private Integer durationMinutes;
        private Long candidateId;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getScheduledTime() { return scheduledTime; }
        public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

        public Integer getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

        public Long getCandidateId() { return candidateId; }
        public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }
    }

    public static class EvaluationDto {
        private Long id;
        private Integer technicalScore;
        private Integer communicationScore;
        private Integer problemSolvingScore;
        private Integer culturalFitScore;
        private String recommendation;
        private String detailedFeedback;
        private LocalDateTime submittedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Integer getTechnicalScore() { return technicalScore; }
        public void setTechnicalScore(Integer technicalScore) { this.technicalScore = technicalScore; }

        public Integer getCommunicationScore() { return communicationScore; }
        public void setCommunicationScore(Integer communicationScore) { this.communicationScore = communicationScore; }

        public Integer getProblemSolvingScore() { return problemSolvingScore; }
        public void setProblemSolvingScore(Integer problemSolvingScore) { this.problemSolvingScore = problemSolvingScore; }

        public Integer getCulturalFitScore() { return culturalFitScore; }
        public void setCulturalFitScore(Integer culturalFitScore) { this.culturalFitScore = culturalFitScore; }

        public String getRecommendation() { return recommendation; }
        public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

        public String getDetailedFeedback() { return detailedFeedback; }
        public void setDetailedFeedback(String detailedFeedback) { this.detailedFeedback = detailedFeedback; }

        public LocalDateTime getSubmittedAt() { return submittedAt; }
        public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    }

    public static class InterviewChatMessageDto {
        private Long id;
        private Long senderId;
        private String senderName;
        private String text;
        private LocalDateTime timestamp;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }

        public String getSenderName() { return senderName; }
        public void setSenderName(String senderName) { this.senderName = senderName; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }

    public static class InterviewAttachmentDto {
        private Long id;
        private Long senderId;
        private String senderName;
        private String fileName;
        private String fileUrl;
        private String fileType;
        private Long fileSize;
        private LocalDateTime uploadedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }

        public String getSenderName() { return senderName; }
        public void setSenderName(String senderName) { this.senderName = senderName; }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }

        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }

        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

        public LocalDateTime getUploadedAt() { return uploadedAt; }
        public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    }
}
