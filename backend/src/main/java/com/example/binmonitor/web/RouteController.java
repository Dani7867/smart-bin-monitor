package com.example.binmonitor.web;

import com.example.binmonitor.service.RouteService;
import com.example.binmonitor.web.dto.RouteDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/route")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping("/today")
    public RouteDTO today() { return routeService.generate(); }
}