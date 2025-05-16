package com.hiragana.controller;

import com.hiragana.model.Drawing;
import com.hiragana.model.User;
import com.hiragana.model.Character;
import com.hiragana.service.DrawingService;
import com.hiragana.service.UserService;
import com.hiragana.service.CharacterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/drawings")
public class DrawingController {
    @Autowired
    private DrawingService drawingService;

    @Autowired
    private UserService userService;

    @Autowired
    private CharacterService characterService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Drawing>> getUserDrawings(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(drawingService.getUserDrawings(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}/character/{characterId}")
    public ResponseEntity<List<Drawing>> getUserDrawingsByCharacter(
            @PathVariable Long userId,
            @PathVariable Long characterId) {
        Optional<User> user = userService.getUserById(userId);
        Optional<Character> character = characterService.getCharacterById(characterId);

        if (user.isPresent() && character.isPresent()) {
            return ResponseEntity.ok(drawingService.getUserDrawingsByCharacter(user.get(), character.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/user/{userId}/character/{characterId}")
    public ResponseEntity<Drawing> saveDrawing(
            @PathVariable Long userId,
            @PathVariable Long characterId,
            @RequestBody Drawing drawing) {
        Optional<User> user = userService.getUserById(userId);
        Optional<Character> character = characterService.getCharacterById(characterId);

        if (user.isPresent() && character.isPresent()) {
            drawing.setUser(user.get());
            drawing.setCharacter(character.get());
            return ResponseEntity.ok(drawingService.evaluateDrawing(drawing));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDrawing(@PathVariable Long id) {
        drawingService.deleteDrawing(id);
        return ResponseEntity.ok().build();
    }
} 