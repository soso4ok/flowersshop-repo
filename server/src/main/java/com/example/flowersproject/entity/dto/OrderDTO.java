package com.example.flowersproject.entity.dto;

import com.example.flowersproject.entity.user.UserEntity;
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
    private double totalPrice;
}
