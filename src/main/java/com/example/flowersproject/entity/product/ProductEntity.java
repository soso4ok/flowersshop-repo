package com.example.flowersproject.entity.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "product_table")
@Inheritance(strategy = InheritanceType.JOINED)
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String description;
    private double price;
    private String count;
    private String available;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id", referencedColumnName = "imageId")
    private ImageEntity image;

}
