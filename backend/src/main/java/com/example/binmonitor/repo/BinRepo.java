package com.example.binmonitor.repo;

import com.example.binmonitor.domain.Bin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BinRepo extends JpaRepository<Bin, Long> {}