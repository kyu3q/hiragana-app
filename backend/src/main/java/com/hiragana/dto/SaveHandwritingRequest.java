package com.hiragana.dto;

import lombok.Data;

@Data
public class SaveHandwritingRequest {
    private Long userId;
    private Long characterId;
    private Integer position;
    private String strokes;
}
