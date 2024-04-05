package com.example.flowersproject.repository;

import com.example.flowersproject.entity.product.BouquetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BouquetRepository extends JpaRepository<BouquetEntity, Long> {

}
