package com.qualhire.backend.repository;

import com.qualhire.backend.model.InterviewAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewAttachmentRepository extends JpaRepository<InterviewAttachment, Long> {
    List<InterviewAttachment> findByInterviewIdOrderByUploadedAtAsc(Long interviewId);
}
