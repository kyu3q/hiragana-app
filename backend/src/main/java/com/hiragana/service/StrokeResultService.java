package com.hiragana.service;

import com.hiragana.model.Character;
import com.hiragana.model.StrokeResult;
import com.hiragana.repository.StrokeResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StrokeResultService {
    @Autowired
    private StrokeResultRepository strokeResultRepository;

    @Autowired
    private CharacterService characterService;

    public StrokeResult saveStrokeResult(Long characterId, StrokeResult strokeResult) {
        Character character = characterService.getCharacterById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        
        Optional<StrokeResult> existingResult = strokeResultRepository.findByCharacter_Id(characterId);
        if (existingResult.isPresent()) {
            StrokeResult result = existingResult.get();
            result.setStrokes(strokeResult.getStrokes());
            result.setScore(strokeResult.getScore());
            result.setComment(strokeResult.getComment());
            return strokeResultRepository.save(result);
        }
        
        strokeResult.setCharacter(character);
        return strokeResultRepository.save(strokeResult);
    }

    public Optional<StrokeResult> getStrokeResult(Long characterId) {
        return strokeResultRepository.findByCharacter_Id(characterId);
    }
} 