package com.salon.backend.controller;

import com.salon.backend.model.Appointment;
import com.salon.backend.model.Notification;
import com.salon.backend.model.User;
import com.salon.backend.repository.AppointmentRepository;
import com.salon.backend.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final AppointmentRepository appointmentRepository;
    private final NotificationRepository notificationRepository;

    public UserController(AppointmentRepository appointmentRepository, NotificationRepository notificationRepository) {
        this.appointmentRepository = appointmentRepository;
        this.notificationRepository = notificationRepository;
    }

    // Book appointment
    @PostMapping("/appointments")
    public ResponseEntity<String> bookAppointment(Authentication authentication, @RequestBody Appointment request) {
        User user = (User) authentication.getPrincipal();
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setServiceType(request.getServiceType());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setStatus("PENDING");
        appointmentRepository.save(appointment);
        return ResponseEntity.ok("Appointment booked, awaiting approval");
    }

    // View dashboard: Appointments + Notifications
    @GetMapping("/dashboard")
    public ResponseEntity<Object> getDashboard(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Appointment> appointments = appointmentRepository.findByUserId(user.getId());
        List<Notification> notifications = notificationRepository.findByUserIdAndReadFalse(user.getId());

        // Mark notifications as read (optional)
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);

        return ResponseEntity.ok(new DashboardResponse(appointments, notifications));
    }

    // Inner class for dashboard response
    public static class DashboardResponse {
        public List<Appointment> appointments;
        public List<Notification> notifications;

        public DashboardResponse(List<Appointment> appointments, List<Notification> notifications) {
            this.appointments = appointments;
            this.notifications = notifications;
        }
    }
}