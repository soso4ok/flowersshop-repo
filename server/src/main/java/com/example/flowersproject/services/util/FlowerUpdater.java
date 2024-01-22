package com.example.flowersproject.services.util;

import com.example.flowersproject.dto.product.FlowerRequest;
import com.example.flowersproject.entity.products.FlowerEntity;
import com.example.flowersproject.entity.products.ImageEntity;

public class FlowerUpdater {

    public static void updateFields(FlowerEntity flowerEntity, FlowerRequest flowerRequest, ImageEntity imageEntity) {
        flowerEntity.setName(flowerRequest.getName());
        flowerEntity.setDescription(flowerRequest.getDescription());
        flowerEntity.setPrice(flowerRequest.getPrice());
        flowerEntity.setAvailable(flowerRequest.getAvailable());
        flowerEntity.setImage(imageEntity);
    }

}
