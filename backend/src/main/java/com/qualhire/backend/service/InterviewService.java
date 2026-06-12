package com.qualhire.backend.service;

import com.qualhire.backend.dto.InterviewDto.*;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final InterviewEvaluationRepository interviewEvaluationRepository;
    private final InterviewChatMessageRepository interviewChatMessageRepository;
    private final InterviewAttachmentRepository interviewAttachmentRepository;
    private final UserRepository userRepository;

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public InterviewService(
            InterviewRepository interviewRepository,
            InterviewEvaluationRepository interviewEvaluationRepository,
            InterviewChatMessageRepository interviewChatMessageRepository,
            InterviewAttachmentRepository interviewAttachmentRepository,
            UserRepository userRepository
    ) {
        this.interviewRepository = interviewRepository;
        this.interviewEvaluationRepository = interviewEvaluationRepository;
        this.interviewChatMessageRepository = interviewChatMessageRepository;
        this.interviewAttachmentRepository = interviewAttachmentRepository;
        this.userRepository = userRepository;

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public InterviewDetailsDto scheduleInterview(User interviewer, ScheduleInterviewRequest request) {
        User managedInterviewer = userRepository.findById(interviewer.getId())
                .orElseThrow(() -> new RuntimeException("Interviewer not found with id: " + interviewer.getId()));

        User candidate = userRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + request.getCandidateId()));

        Interview interview = new Interview();
        interview.setTitle(request.getTitle());
        interview.setDescription(request.getDescription());
        
        String rawTime = request.getScheduledTime();
        interview.setScheduledTime(parseDateTime(rawTime));
        
        interview.setDurationMinutes(request.getDurationMinutes());
        interview.setRoomCode(UUID.randomUUID().toString());
        interview.setStatus("SCHEDULED");
        interview.setCandidate(candidate);
        interview.setInterviewer(managedInterviewer);

        Interview saved = interviewRepository.save(interview);
        return mapToInterviewDetailsDto(saved);
    }

    public List<InterviewDetailsDto> getInterviewsForUser(User user) {
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + user.getId()));

        List<Interview> list;
        if ("candidate".equalsIgnoreCase(managedUser.getRole())) {
            list = interviewRepository.findByCandidateIdOrderByScheduledTimeDesc(managedUser.getId());
        } else {
            list = interviewRepository.findByInterviewerIdOrderByScheduledTimeDesc(managedUser.getId());
        }

        return list.stream()
                .map(this::mapToInterviewDetailsDto)
                .collect(Collectors.toList());
    }

    public InterviewDetailsDto getInterviewById(Long id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found with id: " + id));
        return mapToInterviewDetailsDto(interview);
    }

    public InterviewDetailsDto getInterviewByRoomCode(String roomCode) {
        Interview interview = interviewRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Interview not found with roomCode: " + roomCode));
        return mapToInterviewDetailsDto(interview);
    }

    public InterviewDetailsDto updateStatus(Long id, String status) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found with id: " + id));
        interview.setStatus(status.toUpperCase());
        Interview saved = interviewRepository.save(interview);
        return mapToInterviewDetailsDto(saved);
    }

    public InterviewDetailsDto saveNotes(Long id, String notes) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found with id: " + id));
        interview.setNotes(notes);
        Interview saved = interviewRepository.save(interview);
        return mapToInterviewDetailsDto(saved);
    }

    public EvaluationDto submitEvaluation(Long id, EvaluationDto evalDto) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found with id: " + id));

        Optional<InterviewEvaluation> existing = interviewEvaluationRepository.findByInterviewId(id);
        InterviewEvaluation eval = existing.orElseGet(InterviewEvaluation::new);

        eval.setInterview(interview);
        eval.setTechnicalScore(evalDto.getTechnicalScore());
        eval.setCommunicationScore(evalDto.getCommunicationScore());
        eval.setProblemSolvingScore(evalDto.getProblemSolvingScore());
        eval.setCulturalFitScore(evalDto.getCulturalFitScore());
        eval.setRecommendation(evalDto.getRecommendation());
        eval.setDetailedFeedback(evalDto.getDetailedFeedback());
        eval.setSubmittedAt(LocalDateTime.now());

        InterviewEvaluation savedEval = interviewEvaluationRepository.save(eval);

        // Auto update interview status to COMPLETED
        interview.setStatus("COMPLETED");
        interviewRepository.save(interview);

        return mapToEvaluationDto(savedEval);
    }

    public EvaluationDto getEvaluationForInterview(Long id) {
        InterviewEvaluation eval = interviewEvaluationRepository.findByInterviewId(id)
                .orElseThrow(() -> new RuntimeException("Evaluation not found for interview id: " + id));
        return mapToEvaluationDto(eval);
    }

    public InterviewChatMessageDto saveChatMessage(User sender, Long interviewId, String text) {
        User managedSender = userRepository.findById(sender.getId())
                .orElseThrow(() -> new RuntimeException("Sender not found with id: " + sender.getId()));

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found with id: " + interviewId));

        InterviewChatMessage msg = new InterviewChatMessage();
        msg.setInterview(interview);
        msg.setSender(managedSender);
        msg.setText(text);
        msg.setTimestamp(LocalDateTime.now());

        InterviewChatMessage saved = interviewChatMessageRepository.save(msg);
        return mapToChatMessageDto(saved);
    }

    public List<InterviewChatMessageDto> getChatHistory(Long interviewId) {
        return interviewChatMessageRepository.findByInterviewIdOrderByTimestampAsc(interviewId)
                .stream()
                .map(this::mapToChatMessageDto)
                .collect(Collectors.toList());
    }

    public InterviewAttachmentDto storeMeetingFile(User sender, Long interviewId, MultipartFile file) {
        User managedSender = userRepository.findById(sender.getId())
                .orElseThrow(() -> new RuntimeException("Sender not found with id: " + sender.getId()));

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found with id: " + interviewId));

        // Normalize file name
        String originalFileName = file.getOriginalFilename();
        String cleanFileName = originalFileName != null ? originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_") : "file";
        String fileName = UUID.randomUUID().toString() + "_" + cleanFileName;

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            InterviewAttachment attachment = new InterviewAttachment();
            attachment.setInterview(interview);
            attachment.setSender(managedSender);
            attachment.setFileName(originalFileName);
            attachment.setFilePath(targetLocation.toString());
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setUploadedAt(LocalDateTime.now());

            InterviewAttachment saved = interviewAttachmentRepository.save(attachment);

            // If file is a recording, update recordingUrl in interview details
            if ("video/webm".equalsIgnoreCase(file.getContentType()) || "video/mp4".equalsIgnoreCase(file.getContentType()) || originalFileName.toLowerCase().contains("recording")) {
                interview.setRecordingUrl("/api/v1/interviews/attachments/download/" + saved.getId());
                interviewRepository.save(interview);
            }

            return mapToAttachmentDto(saved);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public List<InterviewAttachmentDto> getMeetingAttachments(Long interviewId) {
        return interviewAttachmentRepository.findByInterviewIdOrderByUploadedAtAsc(interviewId)
                .stream()
                .map(this::mapToAttachmentDto)
                .collect(Collectors.toList());
    }

    // Helper mappers
    private InterviewDetailsDto mapToInterviewDetailsDto(Interview interview) {
        InterviewDetailsDto dto = new InterviewDetailsDto();
        dto.setId(interview.getId());
        dto.setTitle(interview.getTitle());
        dto.setDescription(interview.getDescription());
        dto.setScheduledTime(interview.getScheduledTime());
        dto.setDurationMinutes(interview.getDurationMinutes());
        dto.setRoomCode(interview.getRoomCode());
        dto.setStatus(interview.getStatus());
        dto.setCandidateId(interview.getCandidate().getId());
        dto.setCandidateName(interview.getCandidate().getName());
        dto.setCandidateEmail(interview.getCandidate().getEmail());
        dto.setInterviewerId(interview.getInterviewer().getId());
        dto.setInterviewerName(interview.getInterviewer().getName());
        dto.setRecordingUrl(interview.getRecordingUrl());
        dto.setNotes(interview.getNotes());
        dto.setCreatedAt(interview.getCreatedAt());

        boolean hasEval = interviewEvaluationRepository.findByInterviewId(interview.getId()).isPresent();
        dto.setHasEvaluation(hasEval);

        return dto;
    }

    private EvaluationDto mapToEvaluationDto(InterviewEvaluation eval) {
        EvaluationDto dto = new EvaluationDto();
        dto.setId(eval.getId());
        dto.setTechnicalScore(eval.getTechnicalScore());
        dto.setCommunicationScore(eval.getCommunicationScore());
        dto.setProblemSolvingScore(eval.getProblemSolvingScore());
        dto.setCulturalFitScore(eval.getCulturalFitScore());
        dto.setRecommendation(eval.getRecommendation());
        dto.setDetailedFeedback(eval.getDetailedFeedback());
        dto.setSubmittedAt(eval.getSubmittedAt());
        return dto;
    }

    private InterviewChatMessageDto mapToChatMessageDto(InterviewChatMessage msg) {
        InterviewChatMessageDto dto = new InterviewChatMessageDto();
        dto.setId(msg.getId());
        dto.setSenderId(msg.getSender().getId());
        dto.setSenderName(msg.getSender().getName());
        dto.setText(msg.getText());
        dto.setTimestamp(msg.getTimestamp());
        return dto;
    }

    private InterviewAttachmentDto mapToAttachmentDto(InterviewAttachment att) {
        InterviewAttachmentDto dto = new InterviewAttachmentDto();
        dto.setId(att.getId());
        dto.setSenderId(att.getSender().getId());
        dto.setSenderName(att.getSender().getName());
        dto.setFileName(att.getFileName());
        dto.setFileUrl("/api/v1/interviews/attachments/download/" + att.getId());
        dto.setFileType(att.getFileType());
        dto.setFileSize(att.getFileSize());
        dto.setUploadedAt(att.getUploadedAt());
        return dto;
    }

    private LocalDateTime parseDateTime(String rawTime) {
        if (rawTime == null) return null;
        rawTime = rawTime.trim();
        rawTime = rawTime.replace(" ", "T");
        
        try {
            return LocalDateTime.parse(rawTime);
        } catch (Exception e) {
            String[] patterns = {
                "yyyy-MM-dd'T'HH:mm",
                "yyyy-MM-dd'T'HH:mm:ss",
                "dd-MM-yyyy'T'HH:mm",
                "dd-MM-yyyy'T'HH:mm:ss",
                "yyyy/MM/dd'T'HH:mm",
                "yyyy/MM/dd'T'HH:mm:ss",
                "dd/MM/yyyy'T'HH:mm",
                "dd/MM/yyyy'T'HH:mm:ss"
            };
            for (String pattern : patterns) {
                try {
                    return LocalDateTime.parse(rawTime, java.time.format.DateTimeFormatter.ofPattern(pattern));
                } catch (Exception ignored) {}
            }
            throw new RuntimeException("Unsupported date format: " + rawTime);
        }
    }
}
