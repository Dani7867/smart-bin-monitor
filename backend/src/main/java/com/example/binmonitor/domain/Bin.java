package com.example.binmonitor.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Bin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double lat;
    private double lon;
    private int capacityLiters;

    @Enumerated(EnumType.STRING)
    private Type type;          // TRASH or RECYCLE

    public enum Type { TRASH, RECYCLE }
}