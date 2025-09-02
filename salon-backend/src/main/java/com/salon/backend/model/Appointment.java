package com.salon.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceType; // e.g., "Haircut", "Coloring"
    private LocalDateTime appointmentTime;
    private String status; // "PENDING", "APPROVED", "REJECTED"
}