package com.KEYSTONE.fieldServiceManagement.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum NotificationType {
    SLA_BREACH("sla_breach"),
    ASSIGNMENT("assignment"),
    INVENTORY("inventory"),
    STATUS_CHANGE("status_change");

    private final String value;

    NotificationType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
