package com.example.flowersproject.services.impl.util;

import com.example.flowersproject.entity.dto.product.FlowerDTO;
import com.example.flowersproject.entity.products.FlowerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface FlowerMapper {

    @Mappings({
            @Mapping(source = "name", target = "name"),
            @Mapping(source = "description", target = "description"),
            @Mapping(source = "price", target = "price"),
            @Mapping(source = "available", target = "available"),
            @Mapping(source = "image", target = "image")
    })
    FlowerDTO toDto(FlowerEntity flowerEntity);

    @Mappings({
            @Mapping(source = "name", target = "name"),
            @Mapping(source = "description", target = "description"),
            @Mapping(source = "price", target = "price"),
            @Mapping(source = "available", target = "available"),
    })
    FlowerEntity toEntity(FlowerDTO flowerDto);

}
