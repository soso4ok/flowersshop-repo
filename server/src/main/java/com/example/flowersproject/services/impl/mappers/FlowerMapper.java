package com.example.flowersproject.services.impl.mappers;

import com.example.flowersproject.dto.FlowerDTO;
import com.example.flowersproject.entity.product.FlowerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface FlowerMapper {

    @Mappings({
            @Mapping(source = "name", target = "name"),
            @Mapping(source = "description", target = "description"),
            @Mapping(source = "price", target = "price"),
            @Mapping(source = "count", target = "count"),
            @Mapping(source = "available", target = "available"),
            @Mapping(source = "image", target = "image")
    })
    FlowerDTO flowerToDto(FlowerEntity flowerEntity);

    @Mappings({
            @Mapping(source = "name", target = "name"),
            @Mapping(source = "description", target = "description"),
            @Mapping(source = "price", target = "price"),
            @Mapping(source = "available", target = "available"),
            @Mapping(source = "count", target = "count"),
            @Mapping(source = "image", target = "image")
    })
    FlowerEntity flowerToEntity(FlowerDTO flowerDto);

}
