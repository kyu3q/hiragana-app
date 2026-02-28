package com.hiragana.repository;

import com.hiragana.model.SavedHandwriting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedHandwritingRepository extends JpaRepository<SavedHandwriting, Long> {
    Optional<SavedHandwriting> findByUserIdAndCharacterId(Long userId, Long characterId);

    List<SavedHandwriting> findByUserId(Long userId);

    @Query("SELECT sh FROM SavedHandwriting sh " +
           "JOIN sh.character c " +
           "WHERE sh.user.id = :userId " +
           "AND c.grade = :grade")
    List<SavedHandwriting> findByUserIdAndGrade(
        @Param("userId") Long userId,
        @Param("grade") Integer grade
    );
}
