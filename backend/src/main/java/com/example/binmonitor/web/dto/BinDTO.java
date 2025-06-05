package com.example.binmonitor.web.dto;

import com.example.binmonitor.domain.Bin.Type;

public record BinDTO(
        Long id,
        String name,
        double lat,
        double lon,
        int capacityLiters,
        Type type,
        Integer latestFillPct   // may be null
) {}