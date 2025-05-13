package com.hiragana.controller;

import com.hiragana.model.Character;
import com.hiragana.model.CharacterType;
import com.hiragana.model.StrokeResult;
import com.hiragana.model.Stroke;
import com.hiragana.model.Point;
import com.hiragana.service.CharacterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.hiragana.model.User;
import com.hiragana.service.UserService;

import java.util.*;

@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"}, 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
             allowedHeaders = "*",
             allowCredentials = "true",
             maxAge = 3600)
public class CharacterController {
    private static final Logger logger = LoggerFactory.getLogger(CharacterController.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private CharacterService characterService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Character>> getAllCharacters() {
        try {
            return ResponseEntity.ok(characterService.getAllCharacters());
        } catch (Exception e) {
            logger.error("文字一覧の取得に失敗しました", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Character>> getCharactersByType(@PathVariable CharacterType type) {
        try {
            return ResponseEntity.ok(characterService.getCharactersByType(type));
        } catch (Exception e) {
            logger.error("文字タイプによる取得に失敗しました: {}", type, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/type/{type}/difficulty/{maxDifficulty}")
    public ResponseEntity<List<Character>> getCharactersByTypeAndDifficulty(
            @PathVariable CharacterType type,
            @PathVariable Integer maxDifficulty) {
        try {
            return ResponseEntity.ok(characterService.getCharactersByTypeAndDifficulty(type, maxDifficulty));
        } catch (Exception e) {
            logger.error("文字の難易度による取得に失敗しました: {}, {}", type, maxDifficulty, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/type/{type}/character/{character}")
    public ResponseEntity<Character> getCharacterByTypeAndCharacter(
            @PathVariable CharacterType type,
            @PathVariable String character) {
        try {
            Optional<Character> result = characterService.getCharacterByTypeAndCharacter(type, character);
            return result.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error getting character by type and character: " + type + ", " + character, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/stroke-result")
    public ResponseEntity<?> getStrokeResult(@PathVariable Long id) {
        try {
            // 現在のユーザーIDを取得
            Long userId = getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ユーザーが認証されていません");
            }

            Optional<StrokeResult> result = characterService.getStrokeResult(id, userId);
            if (result.isPresent()) {
                return ResponseEntity.ok(result.get());
            }
            StrokeResult emptyResult = new StrokeResult();
            emptyResult.setStrokes(new ArrayList<>());
            return ResponseEntity.ok(emptyResult);
        } catch (Exception e) {
            logger.error("ストローク結果の取得に失敗しました: {}", id, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "ストローク結果の取得に失敗しました");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/{id}/stroke-result")
    public ResponseEntity<?> saveStrokeResult(@PathVariable Long id, @RequestBody StrokeResult strokeResult) {
        try {
            // 現在のユーザーIDを取得
            Long userId = getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ユーザーが認証されていません");
            }

            if (strokeResult == null || strokeResult.getPosition() == null) {
                return ResponseEntity.badRequest().body("ストローク結果または位置情報が設定されていません");
            }

            // ストロークとポイントの親子関係をセット
            if (strokeResult.getStrokes() != null) {
                for (Stroke stroke : strokeResult.getStrokes()) {
                    stroke.setStrokeResult(strokeResult);
                    if (stroke.getPoints() != null) {
                        for (Point point : stroke.getPoints()) {
                            point.setStroke(stroke);
                        }
                    }
                }
            }

            StrokeResult savedResult = characterService.saveStrokeResult(id, userId, strokeResult);
            return ResponseEntity.ok(savedResult);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("ストローク結果の保存に失敗しました: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Character> createCharacter(@RequestBody Character character) {
        try {
            return ResponseEntity.ok(characterService.createCharacter(character));
        } catch (Exception e) {
            logger.error("Error creating character", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Character> updateCharacter(@PathVariable Long id, @RequestBody Character character) {
        try {
            character.setId(id);
            return ResponseEntity.ok(characterService.updateCharacter(character));
        } catch (Exception e) {
            logger.error("Error updating character: " + id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharacter(@PathVariable Long id) {
        try {
            characterService.deleteCharacter(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting character: " + id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/proxy/aitopia")
    public ResponseEntity<?> proxyAitopiaRequest(@RequestBody String body) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                "https://extensions.aitopia.ai/ai/prompts",
                HttpMethod.POST,
                entity,
                String.class
            );
            
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            logger.error("Aitopia APIへのリクエストに失敗しました", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("APIリクエストに失敗しました: " + e.getMessage());
        }
    }

    @PostMapping("/proxy/aitopia/lang")
    public ResponseEntity<?> proxyAitopiaLangRequest(@RequestBody String body) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                "https://extensions.aitopia.ai/languages/lang/get/lang/ja",
                HttpMethod.POST,
                entity,
                String.class
            );
            
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            logger.error("Error proxying request to Aitopia Lang", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error proxying request: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/stroke-results")
    public ResponseEntity<List<StrokeResult>> getAllStrokeResults(@PathVariable Long id) {
        // 現在のユーザーIDを取得
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<StrokeResult> results = characterService.getAllStrokeResultsByCharacterIdAndUserId(id, userId);
        return ResponseEntity.ok(results);
    }

    // 現在のユーザーIDを取得するヘルパーメソッド
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return userService.getUserByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElse(null);
        }
        return null;
    }
} 