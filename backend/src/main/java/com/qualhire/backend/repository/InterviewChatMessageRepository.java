package com.qualhire.backend.repository;

import com.qualhire.backend.model.InterviewChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewChatMessageRepository extends JpaRepository<InterviewChatMessage, Long> {
    List<InterviewChatMessage> findByInterviewIdOrderByTimestampAsc(Long interviewId);
}
