package com.example.binmonitor.web;

import com.example.binmonitor.domain.*;
import com.example.binmonitor.repo.*;
import com.example.binmonitor.web.dto.FillCreateDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fills")
@RequiredArgsConstructor
public class FillController {

    private final BinRepo  binRepo;
    private final FillRepo fillRepo;

    @PostMapping
    public Fill add(@RequestBody FillCreateDTO dto) {
        Bin bin = binRepo.findById(dto.binId()).orElseThrow();
        return fillRepo.save(Fill.builder()
                .bin(bin)
                .fillPct(dto.fillPct())
                .tempC(dto.tempC())
                .build());
    }
}