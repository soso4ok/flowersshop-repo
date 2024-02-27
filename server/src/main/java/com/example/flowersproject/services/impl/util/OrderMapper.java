package com.example.flowersproject.services.impl.util;

import com.example.flowersproject.entity.dto.OrderDTO;
import com.example.flowersproject.entity.dto.ProductDTO;
import com.example.flowersproject.entity.order.OrderEntity;
import com.example.flowersproject.entity.order.OrderItemEntity;
import com.example.flowersproject.entity.product.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "orderStatus", target = "orderStatus")
    OrderDTO orderToDto(OrderEntity orderEntity);


    List<OrderDTO> orderToDtoList(List<OrderEntity> orderEntities);

    default List<OrderItemEntity> mapProductEntitiesToOrderItems(OrderEntity orderEntity, List<ProductDTO> products) {
        List<OrderItemEntity> orderItems = products.stream()
                .map(product -> {
                    OrderItemEntity orderItem = new OrderItemEntity();
                    orderItem.setOrder(orderEntity);
                    orderItem.setName(product.getName());
                    orderItem.setDescription(product.getDescription());
                    orderItem.setPrice(product.getPrice());
                    orderItem.setCount(product.getCount());
                    return orderItem;
                })
                .collect(Collectors.toList());
        return orderItems;
    }
}
