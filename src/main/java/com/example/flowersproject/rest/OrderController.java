package com.example.flowersproject.rest;

import com.example.flowersproject.dto.CreateOrderRequest;
import com.example.flowersproject.dto.OrderDTO;
import com.example.flowersproject.entity.order.OrderStatusEntity;
import com.example.flowersproject.services.impl.OrderServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/order")
public class OrderController {

    private final OrderServiceImpl orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request.getUser(), request.getProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable("id") Long id) {
        var orderEntity =
                orderService.getOrderById(id);
        return ResponseEntity.ok(orderEntity);
    }
    @PutMapping("/{orderId}")
    public ResponseEntity<?> updateOrder(@PathVariable("orderId") Long orderId,
                                         @RequestBody OrderDTO updatedOrder
    ) {
        try {
            var result = orderService.updateOrder(orderId, updatedOrder);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update order: " + e.getMessage() + orderId);
        }
    }
    @DeleteMapping("/{orderId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteOrderById(@PathVariable Long orderId) {
            return orderService.deleteOrderById(orderId);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersForUser(@PathVariable("userId") Long userId) {
            var orders = orderService.getOrdersForUser(userId);
            return ResponseEntity.ok(orders);
    }
    @PutMapping("/status/{orderId}")
    public ResponseEntity<?> changeOrderStatus(@PathVariable("orderId") Long orderId,
                                               @RequestBody Map<String, String> requestBody) {
        try {
            String newStatusString = requestBody.get("newStatus");
            if (newStatusString == null) {
                return ResponseEntity.badRequest().body("New status is required.");
            }

            OrderStatusEntity newStatus = OrderStatusEntity.valueOf(newStatusString);

            return orderService.changeOrderStatus(orderId, newStatus);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid new status: " + e.getMessage());
        }
    }
    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        return orderService.getAllOrders();
    }


}
