package com.example.flowersproject.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private UserDTO user;
    private String orderStatus;
    private List<ProductDTO> orderItems;
    private Date orderDate;
    private double totalPrice; // Server-computed; client input ignored
}
