package com.example.flowersproject.services.impl;

import com.example.flowersproject.dto.OrderDTO;
import com.example.flowersproject.dto.ProductDTO;
import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.entity.order.OrderEntity;
import com.example.flowersproject.entity.order.OrderItemEntity;
import com.example.flowersproject.entity.order.OrderStatusEntity;
import com.example.flowersproject.entity.product.ProductEntity;
import com.example.flowersproject.repository.OrderRepository;
import com.example.flowersproject.repository.ProductRepository;
import com.example.flowersproject.repository.UserRepository;
import com.example.flowersproject.services.OrderService;
import com.example.flowersproject.services.util.OrderServiceHelper;
import com.example.flowersproject.services.mappers.OrderMapper;
import com.example.flowersproject.services.mappers.UserMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Service;

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
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public ResponseEntity<?> createOrder(UserDTO user, List<ProductDTO> products) {
        try {
            if (user == null) {
                return ResponseEntity.badRequest().body("User information is required");
            }
            if (products == null || products.isEmpty()) {
                return ResponseEntity.badRequest().body("Products list cannot be empty");
            }

            OrderEntity orderEntity = new OrderEntity();

            var userEntity = userRepository.findById(user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found: id=" + user.getId()));
            orderEntity.setUser(userEntity);
            orderEntity.setOrderDate(new Date());

            // Build order items from authoritative DB product data; ignore client-sent prices
            List<OrderItemEntity> orderItems = products.stream().map(requestProduct -> {
                Long productId = requestProduct.getId();
                ProductEntity dbProduct = productRepository.findById(productId)
                        .orElseThrow(() -> new IllegalArgumentException("Product not found: id=" + productId));

                OrderItemEntity orderItem = new OrderItemEntity();
                orderItem.setOrder(orderEntity);
                orderItem.setProductId(dbProduct.getId());
                orderItem.setName(dbProduct.getName());
                orderItem.setDescription(dbProduct.getDescription());
                orderItem.setPrice(dbProduct.getPrice());
                orderItem.setCount(requestProduct.getCount());
                var image = dbProduct.getImage();
                if (image != null) {
                    orderItem.setImageId(image.getImageId());
                }
                orderItem.setAvailable(dbProduct.getAvailable());
                return orderItem;
            }).toList();
            orderEntity.setOrderItems(orderItems);

            orderEntity.setOrderStatus(OrderStatusEntity.IN_PROCESS);

            // Calculate total from server-side items (price * count)
            orderEntity.setTotalPrice(orderServiceHelper.calculateTotalPrice(orderItems));

            OrderEntity savedOrder = orderRepository.save(orderEntity);
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

                if (order.getUser() != null && order.getUser().getId() != null) {
                    var userEntity = userRepository.findById(order.getUser().getId())
                            .orElseThrow(() -> new IllegalArgumentException("User not found: id=" + order.getUser().getId()));
                    existingOrder.setUser(userEntity);
                }
                existingOrder.setOrderDate(order.getOrderDate());
                existingOrder.setOrderStatus(OrderStatusEntity.valueOf(order.getOrderStatus()));
                // Ignore client-sent totalPrice; recompute from existing order items
                if (existingOrder.getOrderItems() != null) {
                    existingOrder.setTotalPrice(orderServiceHelper.calculateTotalPrice(existingOrder.getOrderItems()));
                }

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
    public ResponseEntity<?> getOrdersForUser(Integer userId) {
        try {
            List<OrderEntity> userOrders = orderRepository.findByUserId(userId);
            if (userOrders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found for the user");
            }
            List<OrderDTO> orderDTOs = orderMapper.orderToDtoList(userOrders);
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch orders for the user: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> changeOrderStatus(Long orderId, OrderStatusEntity newStatus) {
        try {
            Optional<OrderEntity> optionalOrderEntity = orderRepository.findById(orderId);
            if (optionalOrderEntity.isPresent()) {
                OrderEntity orderEntity = optionalOrderEntity.get();

                orderEntity.setOrderStatus(newStatus);

                orderRepository.save(orderEntity);

                return ResponseEntity.ok("Order status updated successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update order status: " + e.getMessage());
        }
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
        try {
            List<OrderEntity> orders = orderRepository.findAll();
            List<OrderDTO> orderDTOs = orderMapper.orderToDtoList(orders);
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch orders: " + e.getMessage());
        }
    }
}
