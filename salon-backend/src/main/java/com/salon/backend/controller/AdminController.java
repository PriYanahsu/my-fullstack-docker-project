package com.salon.backend.controller;

import com.salon.backend.dto.UserDTO;
import com.salon.backend.model.Appointment;
import com.salon.backend.model.Notification;
import com.salon.backend.model.User;
import com.salon.backend.repository.AppointmentRepository;
import com.salon.backend.repository.NotificationRepository;
import com.salon.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationRepository notificationRepository;

    public AdminController(UserRepository userRepository, AppointmentRepository appointmentRepository, NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(u -> new UserDTO(
                        u.getId(),
                        u.getEmail(),
                        u.getRole(),
                        u.getUsername()
                ))
                .toList();
    }

    // Grant access to a user (e.g., approve registration or change role)
    @PutMapping("/users/{userId}/grant-access")
    public ResponseEntity<String> grantAccess(@PathVariable Long userId, @RequestBody String newRole) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setRole(newRole); // e.g., "USER" to activate
        userRepository.save(user);
        return ResponseEntity.ok("Access granted");
    }

    // Approve/Reject appointment
    @PutMapping("/appointments/{appointmentId}/approve")
    public ResponseEntity<String> approveAppointment(@PathVariable Long appointmentId, @RequestBody String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow();
        appointment.setStatus(status); // "APPROVED" or "REJECTED"
        appointmentRepository.save(appointment);

        // Send notification to user
        Notification notification = new Notification();
        notification.setUser(appointment.getUser());
        notification.setMessage("Your appointment is " + status);
        notification.setRead(false);
        notificationRepository.save(notification);

        return ResponseEntity.ok("Appointment updated");
    }

    // View all pending appointments
    @GetMapping("/appointments/pending")
    public List<Appointment> getPendingAppointments() {
        return appointmentRepository.findByStatus("PENDING");
    }

    // Manage services (add new hair services)
    // Add more endpoints as needed, e.g., for deleting users, etc.
}