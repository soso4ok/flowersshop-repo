package com.example.flowersproject.services.mappers;

import com.example.flowersproject.dto.OrderDTO;
import com.example.flowersproject.dto.ProductDTO;
import com.example.flowersproject.entity.order.OrderEntity;
import com.example.flowersproject.entity.order.OrderItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface OrderMapper {

    @Mapping(source = "user", target = "user")
    @Mapping(source = "orderStatus", target = "orderStatus")
    @Mapping(source = "orderItems", target = "orderItems")
    @Mapping(source = "orderDate", target = "orderDate")
    @Mapping(source = "totalPrice", target = "totalPrice")
    OrderDTO orderToDto(OrderEntity orderEntity);

    List<OrderDTO> orderToDtoList(List<OrderEntity> orderEntities);

    @Mapping(target = "id", source = "productId")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "count", source = "count")
    @Mapping(target = "available", source = "available")
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "imageId", source = "imageId")
    ProductDTO orderItemToProductDto(OrderItemEntity orderItemEntity);

    // Helper method (kept for reference; MapStruct can map lists automatically)
    default List<ProductDTO> mapOrderItemsToProductDtos(List<OrderItemEntity> orderItems) {
        if (orderItems == null) {
            return null;
        }
        return orderItems.stream()
                .map(this::orderItemToProductDto)
                .collect(Collectors.toList());
    }

    @Deprecated
    default List<OrderItemEntity> mapProductEntitiesToOrderItems(OrderEntity orderEntity, List<ProductDTO> products) {
        return products.stream().map(product -> {
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrder(orderEntity);
            orderItem.setName(product.getName());
            orderItem.setDescription(product.getDescription());
            orderItem.setPrice(0.0); // price removed from DTO, set to 0 as placeholder
            orderItem.setCount(product.getCount());
            orderItem.setImageId(product.getImageId());
            return orderItem;
        }).collect(Collectors.toList());
    }
}
