package com.hiragana.controller;

import com.hiragana.model.Character;
import com.hiragana.model.CharacterType;
import com.hiragana.model.StrokeResult;
import com.hiragana.service.CharacterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = "http://localhost:5173")
public class CharacterController {
    @Autowired
    private CharacterService characterService;

    @GetMapping
    public ResponseEntity<List<Character>> getAllCharacters() {
        return ResponseEntity.ok(characterService.getAllCharacters());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Character>> getCharactersByType(@PathVariable CharacterType type) {
        return ResponseEntity.ok(characterService.getCharactersByType(type));
    }

    @GetMapping("/type/{type}/difficulty/{maxDifficulty}")
    public ResponseEntity<List<Character>> getCharactersByTypeAndDifficulty(
            @PathVariable CharacterType type,
            @PathVariable Integer maxDifficulty) {
        return ResponseEntity.ok(characterService.getCharactersByTypeAndDifficulty(type, maxDifficulty));
    }

    @GetMapping("/type/{type}/character/{character}")
    public ResponseEntity<Character> getCharacterByTypeAndCharacter(
            @PathVariable CharacterType type,
            @PathVariable String character) {
        Optional<Character> result = characterService.getCharacterByTypeAndCharacter(type, character);
        return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/stroke-result")
    public ResponseEntity<StrokeResult> getStrokeResult(@PathVariable Long id) {
        Optional<StrokeResult> result = characterService.getStrokeResult(id);
        return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/stroke-result")
    public ResponseEntity<StrokeResult> saveStrokeResult(
            @PathVariable Long id,
            @RequestBody StrokeResult strokeResult) {
        return ResponseEntity.ok(characterService.saveStrokeResult(id, strokeResult));
    }

    @PostMapping
    public ResponseEntity<Character> createCharacter(@RequestBody Character character) {
        return ResponseEntity.ok(characterService.createCharacter(character));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Character> updateCharacter(@PathVariable Long id, @RequestBody Character character) {
        character.setId(id);
        return ResponseEntity.ok(characterService.updateCharacter(character));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharacter(@PathVariable Long id) {
        characterService.deleteCharacter(id);
        return ResponseEntity.ok().build();
    }
} 