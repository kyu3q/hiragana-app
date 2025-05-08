package com.hiragana.service;

import com.hiragana.model.Progress;
import com.hiragana.model.User;
import com.hiragana.model.Character;
import com.hiragana.model.CharacterType;
import com.hiragana.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProgressService {
    @Autowired
    private ProgressRepository progressRepository;

    public List<Progress> getUserProgress(User user) {
        return progressRepository.findByUser(user);
    }

    public List<Progress> getUserProgressByType(User user, CharacterType type) {
        return progressRepository.findByUserAndCharacter_Type(user, type);
    }

    public Optional<Progress> getProgress(User user, Character character) {
        return progressRepository.findByUserAndCharacter(user, character);
    }

    public Progress updateProgress(User user, Character character, Integer score) {
        Progress progress = progressRepository.findByUserAndCharacter(user, character)
                .orElse(new Progress());

        progress.setUser(user);
        progress.setCharacter(character);
        progress.setPracticeCount(progress.getPracticeCount() + 1);
        progress.setCorrectCount(progress.getCorrectCount() + (score > 0 ? 1 : 0));
        progress.setTotalScore(progress.getTotalScore() + score);
        progress.setHighestScore(Math.max(progress.getHighestScore(), score));
        progress.setLastPracticed(LocalDateTime.now());

        // 習熟度レベルの更新
        int correctRate = (progress.getCorrectCount() * 100) / progress.getPracticeCount();
        if (correctRate >= 90) {
            progress.setMasteryLevel(5);
        } else if (correctRate >= 75) {
            progress.setMasteryLevel(4);
        } else if (correctRate >= 60) {
            progress.setMasteryLevel(3);
        } else if (correctRate >= 40) {
            progress.setMasteryLevel(2);
        } else {
            progress.setMasteryLevel(1);
        }

        return progressRepository.save(progress);
    }

    public void deleteProgress(Long id) {
        progressRepository.deleteById(id);
    }
} 