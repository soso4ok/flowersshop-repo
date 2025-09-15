package com.example.flowersproject.services.util;

import com.example.flowersproject.entity.order.OrderItemEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderServiceHelper {
    public double calculateTotalPrice(List<OrderItemEntity> orderItems) {
        double totalPrice = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getCount())
                .sum();
        return totalPrice;
    }
}
