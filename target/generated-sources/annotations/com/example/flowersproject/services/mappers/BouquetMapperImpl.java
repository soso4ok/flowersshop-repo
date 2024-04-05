package com.example.flowersproject.services.mappers;

import com.example.flowersproject.dto.BouquetDTO;
import com.example.flowersproject.entity.product.BouquetEntity;
import java.util.HashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-04-05T20:44:10+0200",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.8.1 (Amazon.com Inc.)"
)
@Component
public class BouquetMapperImpl implements BouquetMapper {

    @Override
    public BouquetDTO toDtoWithFlowerIds(BouquetEntity bouquetEntity) {
        if ( bouquetEntity == null ) {
            return null;
        }

        BouquetDTO bouquetDTO = new BouquetDTO();

        bouquetDTO.setId( bouquetEntity.getId() );
        bouquetDTO.setName( bouquetEntity.getName() );
        bouquetDTO.setDescription( bouquetEntity.getDescription() );
        bouquetDTO.setPrice( bouquetEntity.getPrice() );
        bouquetDTO.setCount( bouquetEntity.getCount() );
        bouquetDTO.setAvailable( bouquetEntity.getAvailable() );
        bouquetDTO.setImage( bouquetEntity.getImage() );
        Set<Long> set = bouquetEntity.getFlowerIds();
        if ( set != null ) {
            bouquetDTO.setFlowerIds( new HashSet<Long>( set ) );
        }

        return bouquetDTO;
    }

    @Override
    public BouquetEntity toEntityWithFlowerIds(BouquetDTO bouquetDTO) {
        if ( bouquetDTO == null ) {
            return null;
        }

        BouquetEntity bouquetEntity = new BouquetEntity();

        Set<Long> set = bouquetDTO.getFlowerIds();
        if ( set != null ) {
            bouquetEntity.setFlowerIds( new HashSet<Long>( set ) );
        }
        bouquetEntity.setId( bouquetDTO.getId() );
        bouquetEntity.setName( bouquetDTO.getName() );
        bouquetEntity.setDescription( bouquetDTO.getDescription() );
        bouquetEntity.setPrice( bouquetDTO.getPrice() );
        bouquetEntity.setCount( bouquetDTO.getCount() );
        bouquetEntity.setAvailable( bouquetDTO.getAvailable() );
        bouquetEntity.setImage( bouquetDTO.getImage() );

        return bouquetEntity;
    }
}
