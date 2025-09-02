package com.salon.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class DashboardResponse {
    private List<AppointmentDTO> appointments;
    private List<NotificationDTO> notifications;

    public DashboardResponse(List<AppointmentDTO> appointments, List<NotificationDTO> notifications) {
        this.appointments = appointments;
        this.notifications = notifications;
    }
}