package com.example.binmonitor.web;

import com.example.binmonitor.domain.Bin;
import com.example.binmonitor.repo.BinRepo;
import com.example.binmonitor.repo.FillRepo;
import com.example.binmonitor.service.BinService;
import com.example.binmonitor.web.dto.BinDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bins")
@RequiredArgsConstructor
public class BinController {

    private final BinRepo   binRepo;
    private final FillRepo  fillRepo;
    private final BinService binService;

    @PostMapping
    public BinDTO create(@RequestBody Bin bin) {
        return binService.toDto(binRepo.save(bin));
    }

    @GetMapping
    public List<BinDTO> list() {
        return binRepo.findAll().stream().map(binService::toDto).toList();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        fillRepo.deleteByBinId(id);   // first remove fills
        binRepo.deleteById(id);
    }
}