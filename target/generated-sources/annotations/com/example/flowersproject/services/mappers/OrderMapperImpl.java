package com.example.flowersproject.services.mappers;

import com.example.flowersproject.dto.OrderDTO;
import com.example.flowersproject.dto.ProductDTO;
import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.dto.UserDTO.UserDTOBuilder;
import com.example.flowersproject.entity.order.OrderEntity;
import com.example.flowersproject.entity.order.OrderItemEntity;
import com.example.flowersproject.entity.user.UserEntity;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-04-05T20:44:10+0200",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.8.1 (Amazon.com Inc.)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public OrderDTO orderToDto(OrderEntity orderEntity) {
        if ( orderEntity == null ) {
            return null;
        }

        OrderDTO orderDTO = new OrderDTO();

        orderDTO.setUser( userEntityToUserDTO( orderEntity.getUser() ) );
        if ( orderEntity.getOrderStatus() != null ) {
            orderDTO.setOrderStatus( orderEntity.getOrderStatus().name() );
        }
        orderDTO.setId( orderEntity.getId() );
        orderDTO.setOrderItems( orderItemEntityListToProductDTOList( orderEntity.getOrderItems() ) );
        orderDTO.setOrderDate( orderEntity.getOrderDate() );
        orderDTO.setTotalPrice( orderEntity.getTotalPrice() );

        return orderDTO;
    }

    @Override
    public List<OrderDTO> orderToDtoList(List<OrderEntity> orderEntities) {
        if ( orderEntities == null ) {
            return null;
        }

        List<OrderDTO> list = new ArrayList<OrderDTO>( orderEntities.size() );
        for ( OrderEntity orderEntity : orderEntities ) {
            list.add( orderToDto( orderEntity ) );
        }

        return list;
    }

    protected UserDTO userEntityToUserDTO(UserEntity userEntity) {
        if ( userEntity == null ) {
            return null;
        }

        UserDTOBuilder userDTO = UserDTO.builder();

        userDTO.id( userEntity.getId() );
        userDTO.firstname( userEntity.getFirstname() );
        userDTO.lastname( userEntity.getLastname() );
        userDTO.email( userEntity.getEmail() );
        userDTO.password( userEntity.getPassword() );
        userDTO.role( userEntity.getRole() );

        return userDTO.build();
    }

    protected ProductDTO orderItemEntityToProductDTO(OrderItemEntity orderItemEntity) {
        if ( orderItemEntity == null ) {
            return null;
        }

        ProductDTO productDTO = new ProductDTO();

        productDTO.setId( orderItemEntity.getId() );
        productDTO.setName( orderItemEntity.getName() );
        productDTO.setDescription( orderItemEntity.getDescription() );
        productDTO.setPrice( orderItemEntity.getPrice() );
        productDTO.setCount( orderItemEntity.getCount() );
        productDTO.setImageId( orderItemEntity.getImageId() );

        return productDTO;
    }

    protected List<ProductDTO> orderItemEntityListToProductDTOList(List<OrderItemEntity> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductDTO> list1 = new ArrayList<ProductDTO>( list.size() );
        for ( OrderItemEntity orderItemEntity : list ) {
            list1.add( orderItemEntityToProductDTO( orderItemEntity ) );
        }

        return list1;
    }
}
