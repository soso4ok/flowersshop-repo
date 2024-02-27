package com.example.flowersproject.entity.dto;

import com.example.flowersproject.entity.product.ImageEntity;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class BouquetDTO {

    private Long id;
    private String name;
    private String description;
    private double price;
    private String count;
    private String available;
    private ImageEntity image;
    private Set<Long> flowerIds;
}
