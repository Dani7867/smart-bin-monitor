package com.example.binmonitor.web;

import com.example.binmonitor.domain.Bin;
import com.example.binmonitor.repo.BinRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bins")
@RequiredArgsConstructor
public class BinController {

    private final BinRepo binRepo;

    @PostMapping
    public Bin create(@RequestBody Bin bin) {
        // ⚠️  In real life add validation; for now just persist
        return binRepo.save(bin);
    }

    @GetMapping
    public List<Bin> list() {
        return binRepo.findAll();
    }
}