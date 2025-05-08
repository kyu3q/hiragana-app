package com.hiragana.repository;

import com.hiragana.model.Character;
import com.hiragana.model.CharacterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CharacterRepository extends JpaRepository<Character, Long> {
    List<Character> findByType(CharacterType type);
    List<Character> findByTypeAndDifficultyLessThanEqual(CharacterType type, Integer difficulty);
    Optional<Character> findByTypeAndCharacter(CharacterType type, String character);
} 