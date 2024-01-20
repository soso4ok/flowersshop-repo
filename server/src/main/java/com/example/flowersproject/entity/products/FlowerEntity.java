package com.example.flowersproject.entity.products;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.relational.core.mapping.Table;

@Entity
@RequiredArgsConstructor
@PrimaryKeyJoinColumn(name = "id", referencedColumnName = "id")
@Table(name = "flower_table")
public class FlowerEntity extends ProductEntity {

    public FlowerEntity(String name, String description, String price, String available, ImageEntity imageEntity) {

    }
}
