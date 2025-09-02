// AppointmentDTO.java
package com.salon.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Long id;
    private String serviceType;
    private LocalDateTime appointmentTime;
    private String status;
}