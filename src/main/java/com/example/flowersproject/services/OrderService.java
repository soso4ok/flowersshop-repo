package com.example.flowersproject.services;

import com.example.flowersproject.dto.OrderDTO;
import com.example.flowersproject.dto.ProductDTO;
import com.example.flowersproject.entity.order.OrderStatusEntity;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface OrderService {
    ResponseEntity<?> createOrder(String email, List<ProductDTO> products);

    ResponseEntity<?> getOrderById(Long orderId);

    ResponseEntity<?> updateOrder(Long orderId, OrderDTO order);

    ResponseEntity<?> deleteOrderById(Long orderId);

    ResponseEntity<?> getOrdersForUser(Integer userId);

    ResponseEntity<?> getAllOrders();

    ResponseEntity<?> changeOrderStatus(Long orderId, OrderStatusEntity newStatus);
}
