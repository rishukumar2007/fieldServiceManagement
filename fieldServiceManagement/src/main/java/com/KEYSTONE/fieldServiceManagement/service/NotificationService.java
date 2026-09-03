package com.KEYSTONE.fieldServiceManagement.service;

import com.KEYSTONE.fieldServiceManagement.dto.NotificationDto;
import com.KEYSTONE.fieldServiceManagement.exception.ResourceNotFoundException;
import com.KEYSTONE.fieldServiceManagement.model.NotificationItem;
import com.KEYSTONE.fieldServiceManagement.model.NotificationType;
import com.KEYSTONE.fieldServiceManagement.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getAllNotifications() {
        return notificationRepository.findAllByOrderByTimestampDesc().stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationItem createNotification(String title, String message, NotificationType type, String workOrderId) {
        String id = "notif-" + UUID.randomUUID().toString().substring(0, 8);
        NotificationItem item = NotificationItem.builder()
                .id(id)
                .title(title)
                .message(message)
                .type(type)
                .timestamp(LocalDateTime.now())
                .read(false)
                .workOrderId(workOrderId)
                .build();

        return notificationRepository.save(item);
    }

    @Transactional
    public void markAsRead(String id) {
        NotificationItem item = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));
        item.setRead(true);
        notificationRepository.save(item);
    }

    @Transactional
    public void clearAll() {
        notificationRepository.deleteAll();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return notificationRepository.countByReadFalse();
    }
}
