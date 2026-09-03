package com.KEYSTONE.fieldServiceManagement.controller;

import com.KEYSTONE.fieldServiceManagement.dto.DashboardSummaryDto;
import com.KEYSTONE.fieldServiceManagement.dto.TechnicianPerformanceDto;
import com.KEYSTONE.fieldServiceManagement.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary() {
        return ResponseEntity.ok(reportService.getDashboardSummary());
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<TechnicianPerformanceDto>> getTechnicianPerformance() {
        return ResponseEntity.ok(reportService.getTechnicianPerformance());
    }
}
