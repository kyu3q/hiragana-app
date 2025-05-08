package com.hiragana.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "drawings")
public class Drawing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "character_id", nullable = false)
    private Character character;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String drawingData; // 描画データ（JSON形式で保存）

    @Column
    private Integer accuracy; // 正確性スコア（0-100）

    @Column
    private Integer speed; // 描画速度（ミリ秒）

    @Column
    private String feedback; // AIからのフィードバック

    @Column(name = "is_correct")
    private Boolean isCorrect; // 正解かどうか

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 