package com.salon.backend.controller;

import com.salon.backend.model.Appointment;
import com.salon.backend.model.Notification;
import com.salon.backend.model.User;
import com.salon.backend.dto.AppointmentDTO;
import com.salon.backend.dto.DashboardResponse;
import com.salon.backend.dto.NotificationDTO;
import com.salon.backend.repository.AppointmentRepository;
import com.salon.backend.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
    public ResponseEntity<String> bookAppointment(Authentication authentication, @RequestBody AppointmentDTO request) {
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
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Appointment> appointments = appointmentRepository.findByUserId(user.getId());
        List<Notification> notifications = notificationRepository.findByUserIdAndReadFalse(user.getId());

        // Mark notifications as read (optional)
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);

        return ResponseEntity.ok(new DashboardResponse(
                appointments.stream().map(this::toAppointmentDTO).collect(Collectors.toList()),
                notifications.stream().map(this::toNotificationDTO).collect(Collectors.toList())
        ));
    }

    // Convert Appointment to DTO
    private AppointmentDTO toAppointmentDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        dto.setServiceType(appointment.getServiceType());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setStatus(appointment.getStatus());
        return dto;
    }

    // Convert Notification to DTO
    private NotificationDTO toNotificationDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        return dto;
    }
}