package com.example.flowersproject.entity.order;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Table;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders_entity_table")
public class OrderItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String description;
    private double price;
    private int count;
    private int imageId;
    private Long productId; // reference to the original product
    private String available; // snapshot at order time

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;


}
