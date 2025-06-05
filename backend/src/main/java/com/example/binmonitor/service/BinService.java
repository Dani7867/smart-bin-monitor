package com.example.binmonitor.service;

import com.example.binmonitor.domain.Bin;
import com.example.binmonitor.domain.Fill;
import com.example.binmonitor.repo.FillRepo;
import com.example.binmonitor.web.dto.BinDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BinService {
    private final FillRepo fillRepo;

    public BinDTO toDto(Bin b) {
        Integer latest = fillRepo
                .findTop1ByBinIdOrderByCreatedAtDesc(b.getId())
                .stream()
                .map(Fill::getFillPct)
                .findFirst()
                .orElse(null);
        return new BinDTO(
                b.getId(), b.getName(), b.getLat(), b.getLon(),
                b.getCapacityLiters(), b.getType(), latest);
    }
}