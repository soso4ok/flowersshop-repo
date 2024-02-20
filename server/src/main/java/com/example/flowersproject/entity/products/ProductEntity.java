package com.example.flowersproject.entity.products;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.relational.core.mapping.Table;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product_table")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String description;
    private String price;
    private String available;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id", referencedColumnName = "imageId")
    private ImageEntity image;

}
