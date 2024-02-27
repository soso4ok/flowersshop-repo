package com.example.flowersproject.services.impl.util;

import com.example.flowersproject.entity.dto.ProductDTO;
import com.example.flowersproject.entity.product.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface ProductMapper {


    @Mappings({
            @Mapping(source = "name", target = "name"),
            @Mapping(source = "description", target = "description"),
            @Mapping(source = "price", target = "price"),
            @Mapping(source = "count", target = "count"),
    })
    ProductDTO productEntityToProductDTO(ProductEntity productEntity);

    @Mappings({
            @Mapping(source = "name", target = "name"),
            @Mapping(source = "description", target = "description"),
            @Mapping(source = "price", target = "price"),
            @Mapping(source = "count", target = "count"),
    })
    ProductEntity productDTOToProductEntity(ProductDTO productDTO);
}