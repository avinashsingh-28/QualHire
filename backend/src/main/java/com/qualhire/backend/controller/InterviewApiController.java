package com.qualhire.backend.controller;

import com.qualhire.backend.dto.InterviewDto.*;
import com.qualhire.backend.model.InterviewAttachment;
import com.qualhire.backend.model.User;
import com.qualhire.backend.repository.InterviewAttachmentRepository;
import com.qualhire.backend.security.UserDetailsImpl;
import com.qualhire.backend.service.InterviewService;
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
@RequestMapping("/api/v1/interviews")
public class InterviewApiController {

    private final InterviewService interviewService;
    private final InterviewAttachmentRepository interviewAttachmentRepository;

    public InterviewApiController(InterviewService interviewService, InterviewAttachmentRepository interviewAttachmentRepository) {
        this.interviewService = interviewService;
        this.interviewAttachmentRepository = interviewAttachmentRepository;
    }

    @PostMapping
    public ResponseEntity<InterviewDetailsDto> scheduleInterview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody ScheduleInterviewRequest request
    ) {
        User user = userDetails.getUser();
        return ResponseEntity.ok(interviewService.scheduleInterview(user, request));
    }

    @GetMapping
    public ResponseEntity<List<InterviewDetailsDto>> getInterviews(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userDetails.getUser();
        return ResponseEntity.ok(interviewService.getInterviewsForUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewDetailsDto> getInterviewById(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterviewById(id));
    }

    @GetMapping("/room/{roomCode}")
    public ResponseEntity<InterviewDetailsDto> getInterviewByRoomCode(@PathVariable String roomCode) {
        return ResponseEntity.ok(interviewService.getInterviewByRoomCode(roomCode));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<InterviewDetailsDto> updateStatus(@PathVariable Long id, @RequestParam("status") String status) {
        return ResponseEntity.ok(interviewService.updateStatus(id, status));
    }

    @PutMapping("/{id}/notes")
    public ResponseEntity<InterviewDetailsDto> updateNotes(@PathVariable Long id, @RequestBody String notes) {
        return ResponseEntity.ok(interviewService.saveNotes(id, notes));
    }

    @PostMapping("/{id}/evaluations")
    public ResponseEntity<EvaluationDto> submitEvaluation(@PathVariable Long id, @RequestBody EvaluationDto evalDto) {
        return ResponseEntity.ok(interviewService.submitEvaluation(id, evalDto));
    }

    @GetMapping("/{id}/evaluations")
    public ResponseEntity<EvaluationDto> getEvaluationForInterview(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getEvaluationForInterview(id));
    }

    @PostMapping("/{id}/attachments")
    public ResponseEntity<InterviewAttachmentDto> uploadMeetingFile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        User user = userDetails.getUser();
        return ResponseEntity.ok(interviewService.storeMeetingFile(user, id, file));
    }

    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<InterviewAttachmentDto>> getMeetingAttachments(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getMeetingAttachments(id));
    }

    @PostMapping("/{id}/chat")
    public ResponseEntity<InterviewChatMessageDto> saveChatMessage(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @RequestBody String text
    ) {
        User user = userDetails.getUser();
        return ResponseEntity.ok(interviewService.saveChatMessage(user, id, text));
    }

    @GetMapping("/{id}/chat")
    public ResponseEntity<List<InterviewChatMessageDto>> getChatHistory(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getChatHistory(id));
    }

    @GetMapping("/attachments/download/{id}")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long id) {
        try {
            InterviewAttachment attachment = interviewAttachmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Attachment not found with id " + id));
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
}
