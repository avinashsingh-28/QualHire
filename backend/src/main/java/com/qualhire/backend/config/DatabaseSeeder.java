package com.qualhire.backend.config;

import com.qualhire.backend.model.Conversation;
import com.qualhire.backend.model.Message;
import com.qualhire.backend.model.User;
import com.qualhire.backend.model.UserChatStatus;
import com.qualhire.backend.repository.ConversationRepository;
import com.qualhire.backend.repository.MessageRepository;
import com.qualhire.backend.repository.UserChatStatusRepository;
import com.qualhire.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserChatStatusRepository userChatStatusRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(
            UserRepository userRepository,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            UserChatStatusRepository userChatStatusRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userChatStatusRepository = userChatStatusRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed candidate if not present
        User candidate = seedUserIfNotFound(
            "Alex Johnson",
            "candidate@qualhire.com",
            "candidate",
            "AJ",
            "Passionate Software Engineer with 3+ years of experience in React, Java, and Spring Boot. Looking for full-time opportunities.",
            "San Francisco, CA",
            "Active 5m ago"
        );

        // Seed recruiter if not present
        User recruiter = seedUserIfNotFound(
            "Sarah Mitchell",
            "recruiter@qualhire.com",
            "recruiter",
            "SM",
            "Senior Recruiter at TechCorp Inc. Always looking for talented developers, software engineers, and engineering managers.",
            "New York, NY",
            "Active now"
        );

        // Seed mentor if not present
        User mentor = seedUserIfNotFound(
            "Dr. Raj Patel",
            "mentor@qualhire.com",
            "mentor",
            "RP",
            "Engineering Manager with 15+ years of experience. Expert in Web Development, React, and System Design. Love helping developers grow.",
            "Austin, TX",
            "Active 1h ago"
        );

        // Seed admin if not present
        User admin = seedUserIfNotFound(
            "Emily Chen",
            "admin@qualhire.com",
            "admin",
            "EC",
            "QualHire Platform Administrator. Please write to me if you face any technical difficulties.",
            "Remote",
            "Active now"
        );

        System.out.println("Users seeded/checked. Verifying conversations...");

        // Create Conversation between Candidate and Recruiter
        createSeedChat(candidate, recruiter, "Hi Alex! I saw your profile on QualHire and we have an exciting Software Engineer role at TechCorp. Let's chat!");

        // Create Conversation between Candidate and Mentor
        createSeedChat(candidate, mentor, "Hello Alex! I am Dr. Raj Patel. I can help you with React mock interviews, Resume reviews, or general career guidance. Let me know when you want to connect!");

        // Create Conversation between Candidate and Admin
        createSeedChat(candidate, admin, "Welcome to QualHire Support! Feel free to ask any questions if you run into any issues on our platform.");

        System.out.println("DatabaseSeeder execution finished successfully.");
    }

    private User seedUserIfNotFound(String name, String email, String role, String avatar, String bio, String location, String lastActive) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            return existing.get();
        }
        User user = new User(
            null,
            name,
            email,
            passwordEncoder.encode("password123"),
            role,
            avatar,
            bio,
            location,
            lastActive
        );
        return userRepository.save(user);
    }

    private void createSeedChat(User u1, User u2, String initialMessageText) {
        Optional<Conversation> existing = conversationRepository.findConversationBetweenUsers(u1, u2);
        if (existing.isPresent()) {
            return;
        }
        Conversation conv = new Conversation(u1, u2);
        Conversation savedConv = conversationRepository.save(conv);

        // Save statuses
        userChatStatusRepository.save(new UserChatStatus(u1, savedConv));
        userChatStatusRepository.save(new UserChatStatus(u2, savedConv));

        // Save initial message
        Message msg = new Message();
        msg.setConversation(savedConv);
        msg.setSender(u2); // Sent by the other user (recruiter/mentor/admin) to the candidate
        msg.setText(initialMessageText);
        msg.setType("CHAT");
        msg.setTimestamp(LocalDateTime.now().minusHours(1));
        msg.setStatus("delivered");
        messageRepository.save(msg);
    }
}
