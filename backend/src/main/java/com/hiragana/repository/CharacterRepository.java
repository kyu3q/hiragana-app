package com.hiragana.repository;

import com.hiragana.model.Character;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CharacterRepository extends JpaRepository<Character, Long> {
    List<Character> findByType(Character.CharacterType type);
    List<Character> findByTypeAndDifficultyLessThanEqual(Character.CharacterType type, Integer difficulty);
    Optional<Character> findByTypeAndCharacter(Character.CharacterType type, String character);
} 