package com.example.flowersproject.services.util;

import com.example.flowersproject.dto.ProductDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderServiceHelper {
    public double calculateTotalPrice(List<ProductDTO> products) {
        double totalPrice = products.stream()
                .mapToDouble(ProductDTO::getPrice)
                .sum();
        return totalPrice;
    }
}
