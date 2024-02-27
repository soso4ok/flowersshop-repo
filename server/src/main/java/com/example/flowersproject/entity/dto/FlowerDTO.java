package com.example.flowersproject.entity.dto;

import com.example.flowersproject.entity.product.ImageEntity;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FlowerDTO {

    private String name;
    private String description;
    private double price;
    private String count;
    private String available;
    private ImageEntity image;


}
