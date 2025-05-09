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
import java.util.ArrayList;

@Service
@Transactional
public class CharacterService {
    private static final Logger logger = LoggerFactory.getLogger(CharacterService.class);

    @Autowired
    private CharacterRepository characterRepository;

    @Autowired
    private StrokeResultRepository strokeResultRepository;

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

    public Optional<StrokeResult> getStrokeResult(Long characterId) {
        return strokeResultRepository.findByCharacter_Id(characterId);
    }

    public StrokeResult findByCharacterIdAndPosition(Long characterId, Integer position) {
        return strokeResultRepository.findByCharacter_IdAndPosition(characterId, position)
            .orElse(null);
    }

    @Transactional
    public StrokeResult saveStrokeResult(StrokeResult strokeResult) {
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