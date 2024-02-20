package com.example.flowersproject.services.impl.util;

import com.example.flowersproject.entity.dto.product.BouquetDTO;
import com.example.flowersproject.entity.dto.product.FlowerDTO;
import com.example.flowersproject.entity.products.BouquetEntity;
import com.example.flowersproject.entity.products.FlowerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.Named;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface BouquetMapper {

    BouquetDTO toDto(BouquetEntity bouquetEntity);

    BouquetEntity toEntity(BouquetDTO bouquetDTO);

    @Mappings({
            @Mapping(target = "id", source = "id"), // Map the id property
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "description", source = "description"),
            @Mapping(target = "price", source = "price"),
            @Mapping(target = "available", source = "available"),
            @Mapping(target = "image", source = "image"),
            @Mapping(target = "flowerIds", source = "flowerIds")
    })
    BouquetDTO toDtoWithFlowerIds(BouquetEntity bouquetEntity);

    @Mappings({
            @Mapping(source = "flowerIds", target = "flowerIds")
    })
    BouquetEntity toEntityWithFlowerIds(BouquetDTO bouquetDTO);

    default List<Long> map(Set<FlowerEntity> flowerEntities) {
        if (flowerEntities == null || flowerEntities.isEmpty()) {
            return Collections.emptyList();
        }
        return flowerEntities.stream()
                .map(FlowerEntity::getId)
                .collect(Collectors.toList());
    }

    default Set<FlowerEntity> map(List<Long> flowerIds) {
        if (flowerIds == null || flowerIds.isEmpty()) {
            return Collections.emptySet();
        }
        return flowerIds.stream()
                .map(id -> {
                    FlowerEntity flowerEntity = new FlowerEntity();
                    flowerEntity.setId(id);
                    return flowerEntity;
                })
                .collect(Collectors.toSet());
    }

}
