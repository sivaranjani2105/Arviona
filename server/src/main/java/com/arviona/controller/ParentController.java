package com.arviona.controller;

import com.arviona.security.UserDetailsImpl;
import com.arviona.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/parents")
@PreAuthorize("hasRole('PARENT')")
public class ParentController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Map<String, Object> dashboardData = dashboardService.getParentDashboard(userDetails.getId());
        return ResponseEntity.ok(dashboardData);
    }
}
