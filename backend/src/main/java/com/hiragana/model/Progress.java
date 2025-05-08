package com.hiragana.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "progress")
public class Progress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "character_id", nullable = false)
    private Character character;

    @Column(nullable = false)
    private Integer practiceCount; // 練習回数

    @Column(nullable = false)
    private Integer correctCount; // 正解回数

    @Column(nullable = false)
    private Integer totalScore; // 累計スコア

    @Column(nullable = false)
    private Integer highestScore; // 最高スコア

    @Column(name = "last_practiced")
    private LocalDateTime lastPracticed;

    @Column(name = "mastery_level")
    private Integer masteryLevel; // 習熟度（1-5）

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        practiceCount = 0;
        correctCount = 0;
        totalScore = 0;
        highestScore = 0;
        masteryLevel = 1;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 