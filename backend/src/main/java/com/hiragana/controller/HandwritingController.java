package com.hiragana.controller;

import com.hiragana.dto.SaveHandwritingRequest;
import com.hiragana.dto.SavedHandwritingResponse;
import com.hiragana.model.SavedHandwriting;
import com.hiragana.service.HandwritingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/handwriting")
public class HandwritingController {
    private static final Logger logger = LoggerFactory.getLogger(HandwritingController.class);

    @Autowired
    private HandwritingService handwritingService;

    @PostMapping
    public ResponseEntity<?> saveHandwriting(@RequestBody SaveHandwritingRequest request) {
        try {
            logger.info("保存リクエスト: userId={}, characterId={}",
                request.getUserId(), request.getCharacterId());

            SavedHandwriting saved = handwritingService.saveHandwriting(request);

            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("message", "保存しました");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("保存エラー", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkExists(
            @RequestParam Long userId,
            @RequestParam Long characterId) {
        Optional<SavedHandwriting> existing = handwritingService.checkExists(userId, characterId);

        Map<String, Object> response = new HashMap<>();
        response.put("exists", existing.isPresent());
        if (existing.isPresent()) {
            response.put("handwritingId", existing.get().getId());
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavedHandwritingResponse>> getUserHandwritings(
            @PathVariable Long userId,
            @RequestParam(required = false) Integer grade) {
        logger.info("取得リクエスト: userId={}, grade={}", userId, grade);

        List<SavedHandwritingResponse> handwritings =
            handwritingService.getUserHandwritings(userId, grade);

        return ResponseEntity.ok(handwritings);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHandwriting(
            @PathVariable Long id,
            @RequestBody SaveHandwritingRequest request) {
        try {
            logger.info("更新リクエスト: id={}", id);

            SavedHandwriting updated = handwritingService.updateHandwriting(id, request);

            Map<String, Object> response = new HashMap<>();
            response.put("id", updated.getId());
            response.put("message", "更新しました");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新エラー", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHandwriting(@PathVariable Long id) {
        try {
            logger.info("削除リクエスト: id={}", id);
            handwritingService.deleteHandwriting(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("削除エラー", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
