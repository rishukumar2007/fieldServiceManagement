package com.KEYSTONE.fieldServiceManagement.Entity;

import com.KEYSTONE.fieldServiceManagement.Enum.Priority;
import com.KEYSTONE.fieldServiceManagement.Enum.WorkOrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "work_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkOrderStatus status;

    @Column(nullable = false)
    private LocalDateTime slaDueAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @Builder.Default
    private Double partsCost = 0.0;

    @Builder.Default
    private Integer laborMinutes = 0;

    @OneToMany(mappedBy = "workOrder", cascade = CascadeType.ALL)
    private List<WorkOrderStatusHistory> history;

    @OneToMany(mappedBy = "workOrder", cascade = CascadeType.ALL)
    private List<PartUsage> partUsages;

    @OneToMany(mappedBy = "workOrder", cascade = CascadeType.ALL)
    private List<TimeLog> timeLogs;
}
