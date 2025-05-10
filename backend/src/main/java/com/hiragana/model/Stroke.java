package com.hiragana.model;

import javax.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "strokes")
public class Stroke {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stroke_result_id", nullable = false)
    @JsonBackReference
    private StrokeResult strokeResult;

    @OneToMany(mappedBy = "stroke", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Point> points;

    private Integer score;
    private String comment;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StrokeResult getStrokeResult() {
        return strokeResult;
    }

    public void setStrokeResult(StrokeResult strokeResult) {
        this.strokeResult = strokeResult;
    }

    public List<Point> getPoints() {
        return points;
    }

    public void setPoints(List<Point> points) {
        this.points = points;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
} 