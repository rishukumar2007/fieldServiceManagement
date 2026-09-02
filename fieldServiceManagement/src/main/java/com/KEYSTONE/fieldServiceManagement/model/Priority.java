package com.KEYSTONE.fieldServiceManagement.model;

public enum Priority {
    LOW(72),
    MEDIUM(48),
    HIGH(24),
    URGENT(4);

    private final int defaultSlaHours;

    Priority(int defaultSlaHours) {
        this.defaultSlaHours = defaultSlaHours;
    }

    public int getDefaultSlaHours() {
        return defaultSlaHours;
    }
}
