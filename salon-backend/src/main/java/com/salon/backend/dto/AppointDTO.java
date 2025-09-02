// AppointmentDTO.java
package com.salon.backend.dto;

import java.time.LocalDateTime;

public record AppointDTO(
        Long id,
        String serviceType,
        LocalDateTime appointmentTime,
        String status,
        Long userId // ✅ Only expose the userId, not the full User object
) {}
