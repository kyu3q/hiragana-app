package com.hiragana.controller;

import com.hiragana.model.Progress;
import com.hiragana.model.User;
import com.hiragana.model.Character;
import com.hiragana.model.CharacterType;
import com.hiragana.service.ProgressService;
import com.hiragana.service.UserService;
import com.hiragana.service.CharacterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:5173")
public class ProgressController {
    @Autowired
    private ProgressService progressService;

    @Autowired
    private UserService userService;

    @Autowired
    private CharacterService characterService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Progress>> getUserProgress(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(progressService.getUserProgress(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<Progress>> getUserProgressByType(
            @PathVariable Long userId,
            @PathVariable CharacterType type) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(progressService.getUserProgressByType(user.get(), type));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/user/{userId}/character/{characterId}")
    public ResponseEntity<Progress> updateProgress(
            @PathVariable Long userId,
            @PathVariable Long characterId,
            @RequestParam Integer score) {
        Optional<User> user = userService.getUserById(userId);
        Optional<Character> character = characterService.getCharacterByTypeAndCharacter(
                CharacterType.HIRAGANA, // TODO: 文字タイプの指定方法を検討
                "あ" // TODO: 文字の指定方法を検討
        );

        if (user.isPresent() && character.isPresent()) {
            return ResponseEntity.ok(progressService.updateProgress(user.get(), character.get(), score));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable Long id) {
        progressService.deleteProgress(id);
        return ResponseEntity.ok().build();
    }
} 