package com.KEYSTONE.fieldServiceManagement.dto;

public class TechnicianPerformanceDto {
    private String id;
    private String name;
    private String avatarUrl;
    private long completedJobs;
    private int slaPercentage;

    public TechnicianPerformanceDto() {
    }

    public TechnicianPerformanceDto(String id, String name, String avatarUrl, long completedJobs, int slaPercentage) {
        this.id = id;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.completedJobs = completedJobs;
        this.slaPercentage = slaPercentage;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private String avatarUrl;
        private long completedJobs;
        private int slaPercentage;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public Builder completedJobs(long completedJobs) { this.completedJobs = completedJobs; return this; }
        public Builder slaPercentage(int slaPercentage) { this.slaPercentage = slaPercentage; return this; }

        public TechnicianPerformanceDto build() {
            return new TechnicianPerformanceDto(id, name, avatarUrl, completedJobs, slaPercentage);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public long getCompletedJobs() { return completedJobs; }
    public void setCompletedJobs(long completedJobs) { this.completedJobs = completedJobs; }

    public int getSlaPercentage() { return slaPercentage; }
    public void setSlaPercentage(int slaPercentage) { this.slaPercentage = slaPercentage; }
}
