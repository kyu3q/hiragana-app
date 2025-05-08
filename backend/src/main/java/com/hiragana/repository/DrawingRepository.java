package com.hiragana.repository;

import com.hiragana.model.Drawing;
import com.hiragana.model.User;
import com.hiragana.model.Character;
import com.hiragana.model.CharacterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DrawingRepository extends JpaRepository<Drawing, Long> {
    List<Drawing> findByUser(User user);
    List<Drawing> findByUserAndCharacter(User user, Character character);
    List<Drawing> findByUserAndCharacter_Type(User user, CharacterType type);
    List<Drawing> findByUserOrderByCreatedAtDesc(User user);
} 