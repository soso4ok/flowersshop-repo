package com.example.flowersproject.dto;

import com.example.flowersproject.entity.product.ImageEntity;
import lombok.Data;

@Data
public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private double price; // Added back for order items
    private int count;
    private String available;
    private ImageEntity image;
    private int imageId;
}
