package com.example.flowersproject.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_product")
public class ProductEntity {

    @Id
    @GeneratedValue
    private Integer id;
    private String title;
    private String subtext;
    private String price;
    @OneToOne
    @JoinColumn(name = "image_id")
    private ImageEntity image;
    private boolean available;

}
