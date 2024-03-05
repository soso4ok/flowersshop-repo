package com.example.flowersproject.dto;

import com.example.flowersproject.entity.product.ImageEntity;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private double price;
    private int count;
}
