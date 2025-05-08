package com.hiragana.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "strokes")
public class Stroke {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    @CollectionTable(name = "stroke_points", joinColumns = @JoinColumn(name = "stroke_id"))
    private List<Point> points;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Point> getPoints() {
        return points;
    }

    public void setPoints(List<Point> points) {
        this.points = points;
    }
} 