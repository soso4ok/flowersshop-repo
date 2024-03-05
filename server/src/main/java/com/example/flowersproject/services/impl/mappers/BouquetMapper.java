package com.example.flowersproject.services.impl.mappers;

import com.example.flowersproject.dto.BouquetDTO;
import com.example.flowersproject.entity.product.BouquetEntity;
import com.example.flowersproject.entity.product.FlowerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface BouquetMapper {


    @Mappings({
            @Mapping(target = "id", source = "id"), // Map the id property
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "description", source = "description"),
            @Mapping(target = "price", source = "price"),
            @Mapping(source = "count", target = "count"),
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
