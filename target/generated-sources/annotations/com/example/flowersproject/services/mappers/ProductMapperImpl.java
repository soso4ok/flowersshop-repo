package com.example.flowersproject.services.mappers;

import com.example.flowersproject.dto.ProductDTO;
import com.example.flowersproject.entity.product.ProductEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-04-05T12:03:40+0200",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.8.1 (Amazon.com Inc.)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public ProductDTO productToDto(ProductEntity productEntity) {
        if ( productEntity == null ) {
            return null;
        }

        ProductDTO productDTO = new ProductDTO();

        productDTO.setId( productEntity.getId() );
        productDTO.setName( productEntity.getName() );
        productDTO.setDescription( productEntity.getDescription() );
        productDTO.setPrice( productEntity.getPrice() );
        productDTO.setAvailable( productEntity.getAvailable() );
        if ( productEntity.getCount() != null ) {
            productDTO.setCount( Integer.parseInt( productEntity.getCount() ) );
        }
        productDTO.setImage( productEntity.getImage() );

        return productDTO;
    }

    @Override
    public ProductEntity productDTOToProductEntity(ProductDTO productDTO) {
        if ( productDTO == null ) {
            return null;
        }

        ProductEntity productEntity = new ProductEntity();

        productEntity.setName( productDTO.getName() );
        productEntity.setDescription( productDTO.getDescription() );
        productEntity.setPrice( productDTO.getPrice() );
        productEntity.setCount( String.valueOf( productDTO.getCount() ) );
        productEntity.setId( productDTO.getId() );
        productEntity.setAvailable( productDTO.getAvailable() );
        productEntity.setImage( productDTO.getImage() );

        return productEntity;
    }
}
