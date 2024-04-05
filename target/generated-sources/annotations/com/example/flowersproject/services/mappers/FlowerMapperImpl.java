package com.example.flowersproject.services.mappers;

import com.example.flowersproject.dto.FlowerDTO;
import com.example.flowersproject.entity.product.FlowerEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-04-05T20:44:10+0200",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.8.1 (Amazon.com Inc.)"
)
@Component
public class FlowerMapperImpl implements FlowerMapper {

    @Override
    public FlowerDTO flowerToDto(FlowerEntity flowerEntity) {
        if ( flowerEntity == null ) {
            return null;
        }

        FlowerDTO flowerDTO = new FlowerDTO();

        flowerDTO.setId( flowerEntity.getId() );
        flowerDTO.setName( flowerEntity.getName() );
        flowerDTO.setDescription( flowerEntity.getDescription() );
        flowerDTO.setPrice( flowerEntity.getPrice() );
        flowerDTO.setCount( flowerEntity.getCount() );
        flowerDTO.setAvailable( flowerEntity.getAvailable() );
        flowerDTO.setImage( flowerEntity.getImage() );

        return flowerDTO;
    }

    @Override
    public FlowerEntity flowerToEntity(FlowerDTO flowerDto) {
        if ( flowerDto == null ) {
            return null;
        }

        FlowerEntity flowerEntity = new FlowerEntity();

        flowerEntity.setName( flowerDto.getName() );
        flowerEntity.setDescription( flowerDto.getDescription() );
        flowerEntity.setPrice( flowerDto.getPrice() );
        flowerEntity.setAvailable( flowerDto.getAvailable() );
        flowerEntity.setCount( flowerDto.getCount() );
        flowerEntity.setImage( flowerDto.getImage() );
        flowerEntity.setId( flowerDto.getId() );

        return flowerEntity;
    }
}
