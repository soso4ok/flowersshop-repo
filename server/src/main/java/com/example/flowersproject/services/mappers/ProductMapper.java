package com.example.flowersproject.services.mappers;

import com.example.flowersproject.dto.ProductDTO;
import com.example.flowersproject.entity.product.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface ProductMapper {


    @Mappings({
            @Mapping(source = "id", target = "id"),
            @Mapping(source = "name", target = "name"),
            @Mapping(source = "description", target = "description"),
            @Mapping(source = "price", target = "price"),
            @Mapping(source = "available", target = "available"),
            @Mapping(source = "count", target = "count"),
            @Mapping(source = "image", target = "image")
    })
    ProductDTO productToDto(ProductEntity productEntity);

    @Mappings({
            @Mapping(source = "name", target = "name"),
            @Mapping(source = "description", target = "description"),
            @Mapping(source = "price", target = "price"),
            @Mapping(source = "count", target = "count"),
    })
    ProductEntity productDTOToProductEntity(ProductDTO productDTO);
}