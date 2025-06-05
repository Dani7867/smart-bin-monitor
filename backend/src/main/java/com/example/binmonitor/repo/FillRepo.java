package com.example.binmonitor.repo;

import com.example.binmonitor.domain.Fill;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FillRepo extends JpaRepository<Fill, Long> {
    List<Fill> findTop1ByBinIdOrderByCreatedAtDesc(Long binId);

    @Modifying
    @Transactional
    void deleteByBinId(Long binId);
}
