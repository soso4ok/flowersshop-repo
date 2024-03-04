package com.example.flowersproject.services.impl;

import com.example.flowersproject.entity.dto.OrderDTO;
import com.example.flowersproject.entity.dto.ProductDTO;
import com.example.flowersproject.entity.dto.UserDTO;
import com.example.flowersproject.entity.order.OrderEntity;
import com.example.flowersproject.entity.order.OrderItemEntity;
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

import javax.naming.NameNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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

            List<OrderItemEntity> orderItems = orderMapper.mapProductEntitiesToOrderItems(orderEntity, products);
            orderEntity.setOrderItems(orderItems);

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
    public ResponseEntity<?> updateOrder(Long orderId, OrderDTO order) {
        try {

            Optional<OrderEntity> optionalOrder = orderRepository.findById(orderId);

            if (optionalOrder.isPresent()) {
                OrderEntity existingOrder = optionalOrder.get();

                existingOrder.setUser(userMapper.userDtoToEntity(order.getUser()));
                existingOrder.setOrderDate(order.getOrderDate());
                existingOrder.setOrderStatus(OrderStatusEntity.valueOf(order.getOrderStatus()));
                existingOrder.setTotalPrice(order.getTotalPrice());

                OrderEntity updatedOrder = orderRepository.save(existingOrder);

                OrderDTO updatedOrderDTO = orderMapper.orderToDto(updatedOrder);

                return ResponseEntity.ok(updatedOrderDTO);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update order: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> deleteOrderById(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Order with ID " + orderId + " not found");
        }
        orderRepository.deleteById(orderId);

        return ResponseEntity.ok("Order with ID " + orderId + " deleted successfully");
    }

    @Override
    public ResponseEntity<?> getOrdersForUser(UserDTO user) {
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

    @Override
    public ResponseEntity<?> getOrderById(Long orderId) {
        try {
            Optional<OrderEntity> optionalOrder = orderRepository.findById(orderId);

            if (optionalOrder.isPresent()) {
                OrderDTO orderDTO = orderMapper.orderToDto(optionalOrder.get());
                return ResponseEntity.ok(orderDTO);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve order: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getAllOrders() {
        return null;
    }
}
