package com.hiragana.repository;

import com.hiragana.model.Progress;
import com.hiragana.model.User;
import com.hiragana.model.Character;
import com.hiragana.model.CharacterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUser(User user);
    List<Progress> findByUserAndCharacter_Type(User user, CharacterType type);
    Optional<Progress> findByUserAndCharacter(User user, Character character);
    List<Progress> findByUserOrderByLastPracticedDesc(User user);
} 