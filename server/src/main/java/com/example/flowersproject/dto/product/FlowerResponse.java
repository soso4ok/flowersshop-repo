package com.example.flowersproject.dto.product;

import com.example.flowersproject.entity.products.FlowerEntity;
import lombok.Data;

@Data
public class FlowerResponse {

    private String name;
    private String description;
    private String price;
    private String available;

    public static FlowerResponse fromEntity(FlowerEntity flowerEntity) {

        FlowerResponse flowerResponse = new FlowerResponse();
        flowerEntity.setName(flowerResponse.getName());
        flowerResponse.setDescription(flowerEntity.getDescription());
        flowerResponse.setPrice(flowerEntity.getPrice());
        flowerResponse.setAvailable(flowerEntity.getAvailable());

        return flowerResponse;

    }

}
