package com.example.binmonitor.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Fill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(nullable = false)
    private Bin bin;

    private int    fillPct;   // 0–100
    private double tempC;

    private Instant createdAt;

    @PrePersist
    void onCreate() { createdAt = Instant.now(); }
}