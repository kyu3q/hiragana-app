package com.hiragana.service;

import com.hiragana.model.Drawing;
import com.hiragana.model.User;
import com.hiragana.model.Character;
import com.hiragana.model.CharacterType;
import com.hiragana.repository.DrawingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DrawingService {
    @Autowired
    private DrawingRepository drawingRepository;

    public List<Drawing> getUserDrawings(User user) {
        return drawingRepository.findByUser(user);
    }

    public List<Drawing> getUserDrawingsByCharacter(User user, Character character) {
        return drawingRepository.findByUserAndCharacter(user, character);
    }

    public List<Drawing> getUserDrawingsByType(User user, CharacterType type) {
        return drawingRepository.findByUserAndCharacter_Type(user, type);
    }

    public Drawing saveDrawing(Drawing drawing) {
        return drawingRepository.save(drawing);
    }

    public Drawing evaluateDrawing(Drawing drawing) {
        // TODO: AIによる描画評価の実装
        // 現在は仮の実装
        drawing.setAccuracy(calculateAccuracy(drawing));
        drawing.setIsCorrect(drawing.getAccuracy() >= 80);
        return drawingRepository.save(drawing);
    }

    private Integer calculateAccuracy(Drawing drawing) {
        // TODO: 実際の評価ロジックの実装
        // 現在は仮の実装
        return 85;
    }

    public void deleteDrawing(Long id) {
        drawingRepository.deleteById(id);
    }
} 