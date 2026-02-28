package com.hiragana.service;

import com.hiragana.dto.SaveHandwritingRequest;
import com.hiragana.dto.SavedHandwritingResponse;
import com.hiragana.model.Character;
import com.hiragana.model.SavedHandwriting;
import com.hiragana.model.User;
import com.hiragana.repository.CharacterRepository;
import com.hiragana.repository.SavedHandwritingRepository;
import com.hiragana.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HandwritingService {

    @Autowired
    private SavedHandwritingRepository savedHandwritingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CharacterRepository characterRepository;

    @Transactional
    public SavedHandwriting saveHandwriting(SaveHandwritingRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

        Character character = characterRepository.findById(request.getCharacterId())
            .orElseThrow(() -> new RuntimeException("文字が見つかりません"));

        SavedHandwriting handwriting = new SavedHandwriting();
        handwriting.setUser(user);
        handwriting.setCharacter(character);
        handwriting.setPosition(request.getPosition());
        handwriting.setStrokes(request.getStrokes());

        return savedHandwritingRepository.save(handwriting);
    }

    @Transactional
    public SavedHandwriting updateHandwriting(Long id, SaveHandwritingRequest request) {
        SavedHandwriting handwriting = savedHandwritingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("保存データが見つかりません"));

        handwriting.setPosition(request.getPosition());
        handwriting.setStrokes(request.getStrokes());

        return savedHandwritingRepository.save(handwriting);
    }

    public Optional<SavedHandwriting> checkExists(Long userId, Long characterId) {
        return savedHandwritingRepository.findByUserIdAndCharacterId(userId, characterId);
    }

    public List<SavedHandwritingResponse> getUserHandwritings(Long userId, Integer grade) {
        List<SavedHandwriting> handwritings;

        if (grade != null) {
            handwritings = savedHandwritingRepository.findByUserIdAndGrade(userId, grade);
        } else {
            handwritings = savedHandwritingRepository.findByUserId(userId);
        }

        return handwritings.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteHandwriting(Long id) {
        savedHandwritingRepository.deleteById(id);
    }

    private SavedHandwritingResponse convertToResponse(SavedHandwriting handwriting) {
        SavedHandwritingResponse response = new SavedHandwritingResponse();
        response.setId(handwriting.getId());
        response.setCharacterId(handwriting.getCharacter().getId());
        response.setCharacter(handwriting.getCharacter().getCharacter());
        response.setGrade(handwriting.getCharacter().getGrade());
        response.setPosition(handwriting.getPosition());
        response.setStrokes(handwriting.getStrokes());
        response.setCreatedAt(handwriting.getCreatedAt());
        return response;
    }
}
