package com.hiragana.service;

import com.hiragana.model.Character;
import com.hiragana.model.CharacterType;
import com.hiragana.model.StrokeResult;
import com.hiragana.repository.CharacterRepository;
import com.hiragana.repository.StrokeResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CharacterService {
    private static final Logger logger = LoggerFactory.getLogger(CharacterService.class);

    @Autowired
    private CharacterRepository characterRepository;

    @Autowired
    private StrokeResultRepository strokeResultRepository;

    @Autowired
    private StrokeResultService strokeResultService;

    public List<Character> getAllCharacters() {
        try {
            logger.debug("Fetching all characters from database");
            List<Character> characters = characterRepository.findAll();
            logger.debug("Found {} characters", characters.size());
            return characters;
        } catch (DataAccessException e) {
            logger.error("Database error while fetching all characters", e);
            throw new RuntimeException("Failed to fetch characters from database", e);
        } catch (Exception e) {
            logger.error("Unexpected error while fetching all characters", e);
            throw new RuntimeException("Unexpected error while fetching characters", e);
        }
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

    @Transactional
    public StrokeResult saveStrokeResult(Long characterId, Long userId, StrokeResult strokeResult) {
        return strokeResultService.saveStrokeResult(characterId, userId, strokeResult);
    }

    public Optional<StrokeResult> getStrokeResult(Long characterId, Long userId) {
        return strokeResultService.getStrokeResult(characterId, userId);
    }

    public List<StrokeResult> getAllStrokeResults(Long characterId, Long userId) {
        return strokeResultService.getAllStrokeResults(characterId, userId);
    }

    public StrokeResult findByCharacterIdAndPosition(Long characterId, Integer position, Long userId) {
        return strokeResultRepository.findByCharacter_IdAndPositionAndUser_Id(characterId, position, userId)
            .orElse(null);
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

    public void deleteStrokeResult(StrokeResult strokeResult) {
        strokeResultRepository.delete(strokeResult);
    }

    public List<StrokeResult> getAllStrokeResultsByCharacterIdAndUserId(Long characterId, Long userId) {
        return strokeResultRepository.findAllByCharacter_IdAndUser_Id(characterId, userId);
    }
} 