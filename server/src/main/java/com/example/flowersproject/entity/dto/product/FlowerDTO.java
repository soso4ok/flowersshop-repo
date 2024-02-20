package com.example.flowersproject.entity.dto.product;

import com.example.flowersproject.entity.products.ImageEntity;
import lombok.Data;

@Data
public class FlowerDTO {

    private String name;
    private String description;
    private String price;
    private String available;
    private ImageEntity image;


}
