package com.hiragana.service;

import com.hiragana.model.Character;
import com.hiragana.model.StrokeResult;
import com.hiragana.model.User;
import com.hiragana.repository.StrokeResultRepository;
import com.hiragana.repository.CharacterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StrokeResultService {
    @Autowired
    private StrokeResultRepository strokeResultRepository;

    @Autowired
    private CharacterRepository characterRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public StrokeResult saveStrokeResult(Long characterId, Long userId, StrokeResult strokeResult) {
        Character character = characterRepository.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // 既存の結果を検索して削除
        Optional<StrokeResult> existingResult = strokeResultRepository.findByCharacter_IdAndPositionAndUser_Id(
            characterId, strokeResult.getPosition(), userId);
        
        if (existingResult.isPresent()) {
            strokeResultRepository.delete(existingResult.get());
        }
        
        // 新しい結果を保存
        strokeResult.setCharacter(character);
        strokeResult.setUser(user);
        return strokeResultRepository.save(strokeResult);
    }

    public Optional<StrokeResult> getStrokeResult(Long characterId, Long userId) {
        return strokeResultRepository.findByCharacter_IdAndUser_Id(characterId, userId);
    }

    public List<StrokeResult> getAllStrokeResults(Long characterId, Long userId) {
        return strokeResultRepository.findAllByCharacter_IdAndUser_Id(characterId, userId);
    }
} 