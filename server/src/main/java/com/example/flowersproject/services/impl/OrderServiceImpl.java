package com.example.flowersproject.services.impl;

import com.example.flowersproject.entity.dto.OrderDTO;
import com.example.flowersproject.entity.dto.ProductDTO;
import com.example.flowersproject.entity.dto.UserDTO;
import com.example.flowersproject.entity.order.OrderEntity;
import com.example.flowersproject.entity.order.OrderStatusEntity;
import com.example.flowersproject.repository.OrderRepository;
import com.example.flowersproject.services.OrderService;
import com.example.flowersproject.services.OrderServiceHelper;
import com.example.flowersproject.services.impl.util.OrderMapper;
import com.example.flowersproject.services.impl.util.ProductMapper;
import com.example.flowersproject.services.impl.util.UserMapper;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderMapper orderMapper;
    private final UserMapper userMapper;
    private final OrderRepository orderRepository;
    private final OrderServiceHelper orderServiceHelper;

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Override
    public ResponseEntity<?> createOrder(UserDTO user, List<ProductDTO> products) {
        try {
            OrderEntity orderEntity = new OrderEntity();

            orderEntity.setUser(userMapper.userDtoToEntity(user));

            orderEntity.setOrderDate(new Date());

            orderEntity.setOrderItems(orderMapper.mapProductEntitiesToOrderItems(orderEntity, products));

            orderEntity.setOrderStatus(OrderStatusEntity.IN_PROCESS);

            orderEntity.setTotalPrice(orderServiceHelper.calculateTotalPrice(products));

            OrderEntity savedOrder = orderRepository.save(orderEntity);

            orderRepository.save(orderEntity);
            return ResponseEntity.status(HttpStatus.CREATED).body(orderMapper.orderToDto(savedOrder));
        } catch (HttpMessageNotReadableException e) {
            return ResponseEntity.badRequest().body("Failed to create order: Invalid JSON format");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create order: " + e.getMessage());
        }
    }


    @Override
    public ResponseEntity<?> getOrderById(Long orderId) {
return null;
    }

    @Override
    public ResponseEntity<?> updateOrder(OrderDTO order) {
        return null;
    }

    @Override
    public void deleteOrderById(Long orderId) {

    }

    @Override
    public ResponseEntity<?> getOrdersForUser(UserDTO user) {
        return null;
    }

    @Override
    public ResponseEntity<?> getAllOrders() {
        return null;
    }


    @Override
    public ResponseEntity<?> checkOrderStatus(OrderDTO order) {
        return null;
    }

    @Override
    public void cancelOrder(OrderDTO order) {

    }

    @Override
    public void markOrderAsDelivered(OrderDTO order) {

    }
}
