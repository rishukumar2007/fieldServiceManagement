package com.KEYSTONE.fieldServiceManagement.repository;

import com.KEYSTONE.fieldServiceManagement.model.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeLogRepository extends JpaRepository<TimeLog, String> {
    List<TimeLog> findByWorkOrderId(String workOrderId);
    List<TimeLog> findByTechnicianId(String technicianId);
}
