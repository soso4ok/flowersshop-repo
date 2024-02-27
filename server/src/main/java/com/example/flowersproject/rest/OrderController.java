package com.example.flowersproject.rest;

import com.example.flowersproject.entity.dto.CreateOrderRequest;
import com.example.flowersproject.entity.dto.OrderDTO;
import com.example.flowersproject.services.impl.OrderServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/order")
public class OrderController {

    private final OrderServiceImpl orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request.getUser(), request.getProducts());
    }
}
