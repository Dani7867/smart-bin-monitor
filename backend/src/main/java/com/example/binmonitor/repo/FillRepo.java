package com.example.binmonitor.repo;

import com.example.binmonitor.domain.Fill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FillRepo extends JpaRepository<Fill, Long> {
    List<Fill> findTop1ByBinIdOrderByCreatedAtDesc(Long binId);
}