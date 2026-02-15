package com.example.flowersproject.entity.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.Specification;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@PrimaryKeyJoinColumn(name = "id", referencedColumnName = "id")
@Table(name = "flower_table")
public class FlowerEntity extends ProductEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "flower_type", nullable = false)
    private FlowerType flowerType = FlowerType.FLOWER;

}
