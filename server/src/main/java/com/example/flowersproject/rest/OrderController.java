package com.example.flowersproject.rest;

import com.example.flowersproject.entity.dto.CreateOrderRequest;
import com.example.flowersproject.entity.dto.OrderDTO;
import com.example.flowersproject.services.impl.OrderServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> deleteOrderById(@PathVariable Long orderId) {
            return orderService.deleteOrderById(orderId);
    }
}
