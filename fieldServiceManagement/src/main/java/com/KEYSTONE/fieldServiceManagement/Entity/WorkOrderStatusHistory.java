package com.KEYSTONE.fieldServiceManagement.Entity;

import com.KEYSTONE.fieldServiceManagement.Enum.WorkOrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "work_order_status_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @Enumerated(EnumType.STRING)
    private WorkOrderStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkOrderStatus toStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_user_id", nullable = false)
    private User changedBy;

    @Column(nullable = false)
    private LocalDateTime changedAt;

    private String note;
}
