package com.qualhire.backend.repository;

import com.qualhire.backend.model.Conversation;
import com.qualhire.backend.model.Message;
import com.qualhire.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationOrderByTimestampAsc(Conversation conversation);

    @Query("SELECT m FROM Message m WHERE m.conversation = :conv AND m.timestamp > :since ORDER BY m.timestamp ASC")
    List<Message> findMessagesSince(@Param("conv") Conversation conv, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation = :conv AND m.sender = :partner AND m.status <> 'read' AND (:since IS NULL OR m.timestamp > :since)")
    long countUnreadMessages(@Param("conv") Conversation conv, @Param("partner") User partner, @Param("since") LocalDateTime since);

    Message findFirstByConversationOrderByTimestampDesc(Conversation conversation);
}
