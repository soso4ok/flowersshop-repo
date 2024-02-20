package com.example.flowersproject.entity.dto.product;

import com.example.flowersproject.entity.products.FlowerEntity;
import com.example.flowersproject.entity.products.ImageEntity;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class BouquetDTO {

    private Long id;
    private String name;
    private String description;
    private String price;
    private String available;
    private ImageEntity image;
    private Set<Long> flowerIds;
}
