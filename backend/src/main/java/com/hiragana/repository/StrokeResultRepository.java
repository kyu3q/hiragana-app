package com.hiragana.repository;

import com.hiragana.model.StrokeResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StrokeResultRepository extends JpaRepository<StrokeResult, Long> {
    Optional<StrokeResult> findByCharacter_IdAndUser_Id(Long characterId, Long userId);
    Optional<StrokeResult> findByCharacter_IdAndPositionAndUser_Id(Long characterId, Integer position, Long userId);
    List<StrokeResult> findAllByCharacter_IdAndUser_Id(Long characterId, Long userId);
} 