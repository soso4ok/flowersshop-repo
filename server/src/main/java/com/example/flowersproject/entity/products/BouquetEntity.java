package com.example.flowersproject.entity.products;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.relational.core.mapping.Table;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_bouquet")
public class BouquetEntity extends ProductEntity {



    @ManyToMany
    @JoinTable(
            name = "bouquet_flower",
            joinColumns = @JoinColumn(name = "bouquet_id"),
            inverseJoinColumns = @JoinColumn(name = "flower_id"))
    private Set<FlowerEntity> flowerEntities;

}
