package com.KEYSTONE.fieldServiceManagement.Entity;
import com.KEYSTONE.fieldServiceManagement.Enum.Priority;
import com.KEYSTONE.fieldServiceManagement.Enum.WorkOrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String workOrderCode;

    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private WorkOrderStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime slaDueDate;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Site site;

    @ManyToOne
    private User assignedTechnician;

    @OneToMany(mappedBy = "workOrder")
    private List<WorkOrderStatusHistory> history;

    @OneToMany(mappedBy = "workOrder")
    private List<PartUsage> partUsages;

    @OneToMany(mappedBy = "workOrder")
    private List<TimeLog> timeLogs;
}