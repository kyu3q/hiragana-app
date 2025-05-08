package com.hiragana.service;

import com.hiragana.model.Character;
import com.hiragana.model.CharacterType;
import com.hiragana.model.StrokeResult;
import com.hiragana.repository.CharacterRepository;
import com.hiragana.repository.StrokeResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CharacterService {
    @Autowired
    private CharacterRepository characterRepository;

    @Autowired
    private StrokeResultRepository strokeResultRepository;

    public List<Character> getAllCharacters() {
        return characterRepository.findAll();
    }

    public Optional<Character> getCharacterById(Long id) {
        return characterRepository.findById(id);
    }

    public List<Character> getCharactersByType(CharacterType type) {
        return characterRepository.findByType(type);
    }

    public List<Character> getCharactersByTypeAndDifficulty(CharacterType type, Integer maxDifficulty) {
        return characterRepository.findByTypeAndDifficultyLessThanEqual(type, maxDifficulty);
    }

    public Optional<Character> getCharacterByTypeAndCharacter(CharacterType type, String character) {
        return characterRepository.findByTypeAndCharacter(type, character);
    }

    public Optional<StrokeResult> getStrokeResult(Long characterId) {
        return strokeResultRepository.findByCharacter_Id(characterId);
    }

    public StrokeResult saveStrokeResult(Long characterId, StrokeResult strokeResult) {
        Character character = characterRepository.findById(characterId)
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

    public Character createCharacter(Character character) {
        return characterRepository.save(character);
    }

    public Character updateCharacter(Character character) {
        if (!characterRepository.existsById(character.getId())) {
            throw new RuntimeException("Character not found");
        }
        return characterRepository.save(character);
    }

    public void deleteCharacter(Long id) {
        characterRepository.deleteById(id);
    }
} 