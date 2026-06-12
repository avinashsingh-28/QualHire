package com.qualhire.backend.repository;

import com.qualhire.backend.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByCandidateIdOrderByScheduledTimeDesc(Long candidateId);
    List<Interview> findByInterviewerIdOrderByScheduledTimeDesc(Long interviewerId);
    Optional<Interview> findByRoomCode(String roomCode);
}
