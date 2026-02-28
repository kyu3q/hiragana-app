package com.hiragana.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SavedHandwritingResponse {
    private Long id;
    private Long characterId;
    private String character;
    private Integer grade;
    private Integer position;
    private String strokes;
    private LocalDateTime createdAt;
}
