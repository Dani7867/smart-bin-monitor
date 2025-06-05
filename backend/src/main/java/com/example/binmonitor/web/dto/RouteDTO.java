package com.example.binmonitor.web.dto;

import java.util.List;

public record RouteDTO(long distanceMeters, List<Long> binOrder) {}