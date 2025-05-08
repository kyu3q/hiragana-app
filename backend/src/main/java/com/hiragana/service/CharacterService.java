package com.hiragana.service;

import com.hiragana.model.Character;
import com.hiragana.repository.CharacterRepository;
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

    public List<Character> getAllCharacters() {
        return characterRepository.findAll();
    }

    public Optional<Character> getCharacterById(Long id) {
        return characterRepository.findById(id);
    }

    public List<Character> getCharactersByType(Character.CharacterType type) {
        return characterRepository.findByType(type);
    }

    public List<Character> getCharactersByTypeAndDifficulty(Character.CharacterType type, Integer maxDifficulty) {
        return characterRepository.findByTypeAndDifficultyLessThanEqual(type, maxDifficulty);
    }

    public Optional<Character> getCharacterByTypeAndCharacter(Character.CharacterType type, String character) {
        return characterRepository.findByTypeAndCharacter(type, character);
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