package com.example.flowersproject.entity.product;

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


    @ElementCollection
    private Set<Long> flowerIds;

}
