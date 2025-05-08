package com.hiragana.repository;

import com.hiragana.model.StrokeResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StrokeResultRepository extends JpaRepository<StrokeResult, Long> {
    Optional<StrokeResult> findByCharacter_Id(Long characterId);
} 