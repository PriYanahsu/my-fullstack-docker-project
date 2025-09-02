// NotificationDTO.java
package com.salon.backend.dto;

import lombok.Data;

@Data
public class NotificationDTO {
    private Long id;
    private String message;
    private boolean read;
}