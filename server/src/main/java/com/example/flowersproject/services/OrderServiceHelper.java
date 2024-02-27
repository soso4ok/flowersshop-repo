package com.example.flowersproject.services;

import com.example.flowersproject.entity.dto.ProductDTO;
import com.example.flowersproject.entity.product.ProductEntity;
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
