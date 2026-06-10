package com.qualhire.backend.repository;

import com.qualhire.backend.model.Conversation;
import com.qualhire.backend.model.User;
import com.qualhire.backend.model.UserChatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserChatStatusRepository extends JpaRepository<UserChatStatus, Long> {
    Optional<UserChatStatus> findByUserAndConversation(User user, Conversation conversation);
}
