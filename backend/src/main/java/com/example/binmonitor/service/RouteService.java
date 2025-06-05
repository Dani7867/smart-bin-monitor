package com.example.binmonitor.service;

import com.example.binmonitor.domain.Bin;
import com.example.binmonitor.domain.Fill;
import com.example.binmonitor.repo.*;
import com.example.binmonitor.web.dto.RouteDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service @RequiredArgsConstructor
public class RouteService {

    private final BinRepo  binRepo;
    private final FillRepo fillRepo;

    // simple nearest-neighbor, depot at lat=0, lon=0
    public RouteDTO generate() {
        record Node(Long id,double lat,double lon){}

        List<Node> targets = new ArrayList<>();
        for (Bin b : binRepo.findAll()) {
            Integer pct = fillRepo.findTop1ByBinIdOrderByCreatedAtDesc(b.getId())
                    .stream().findFirst().map(Fill::getFillPct).orElse(0);
            if (pct >= 70) targets.add(new Node(b.getId(), b.getLat(), b.getLon()));
        }
        double curLat = 0, curLon = 0, total = 0;
        List<Long> order = new ArrayList<>();

        while (!targets.isEmpty()) {
            Node bestNode = null; double bestDist = Double.MAX_VALUE;
            for (Node n : targets) {
                double d = haversine(curLat, curLon, n.lat, n.lon);
                if (d < bestDist) { bestDist = d; bestNode = n; }
            }
            order.add(bestNode.id);
            total += bestDist;
            curLat = bestNode.lat;
            curLon = bestNode.lon;
            targets.remove(bestNode);
        }
        return new RouteDTO(Math.round(total), order);
    }

    private static double haversine(double lat1,double lon1,double lat2,double lon2){
        double R=6371e3;
        double φ1=Math.toRadians(lat1), φ2=Math.toRadians(lat2);
        double Δφ=Math.toRadians(lat2-lat1);
        double Δλ=Math.toRadians(lon2-lon1);
        double a=Math.sin(Δφ/2)*Math.sin(Δφ/2)+
                Math.cos(φ1)*Math.cos(φ2)*
                        Math.sin(Δλ/2)*Math.sin(Δλ/2);
        return 2*R*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    }
}