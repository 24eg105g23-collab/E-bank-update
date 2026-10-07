package com.ebank.update.dto;

import java.util.List;

public class AdminDashboardDto {
    private long totalCustomers;
    private long pendingRequests;
    private long approvedRequests;
    private long rejectedRequests;
    private List<?> recentRequests;

    public AdminDashboardDto() {}

    public AdminDashboardDto(long totalCustomers, long pendingRequests, long approvedRequests, long rejectedRequests, List<?> recentRequests) {
        this.totalCustomers = totalCustomers;
        this.pendingRequests = pendingRequests;
        this.approvedRequests = approvedRequests;
        this.rejectedRequests = rejectedRequests;
        this.recentRequests = recentRequests;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getApprovedRequests() {
        return approvedRequests;
    }

    public void setApprovedRequests(long approvedRequests) {
        this.approvedRequests = approvedRequests;
    }

    public long getRejectedRequests() {
        return rejectedRequests;
    }

    public void setRejectedRequests(long rejectedRequests) {
        this.rejectedRequests = rejectedRequests;
    }

    public List<?> getRecentRequests() {
        return recentRequests;
    }

    public void setRecentRequests(List<?> recentRequests) {
        this.recentRequests = recentRequests;
    }
}
