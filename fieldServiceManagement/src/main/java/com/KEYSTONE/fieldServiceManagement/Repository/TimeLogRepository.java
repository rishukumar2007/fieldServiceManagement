package com.KEYSTONE.fieldServiceManagement.Repository;

import com.KEYSTONE.fieldServiceManagement.Entity.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {
    List<TimeLog> findByWorkOrderId(Long workOrderId);
}
