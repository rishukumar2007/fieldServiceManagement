package com.KEYSTONE.fieldServiceManagement.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private WorkOrder workOrder;

    @ManyToOne
    private User technician;

    private Integer minutesWorked;

    private String note;

    private LocalDateTime logTime;
}