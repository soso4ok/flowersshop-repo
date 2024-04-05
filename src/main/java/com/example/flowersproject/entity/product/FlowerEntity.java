package com.example.flowersproject.entity.product;

import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.relational.core.mapping.Table;

@Entity
@RequiredArgsConstructor
@PrimaryKeyJoinColumn(name = "id", referencedColumnName = "id")
@Table(name = "flower_table")
public class FlowerEntity extends ProductEntity {


}
