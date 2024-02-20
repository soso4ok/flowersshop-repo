package com.example.flowersproject.repository;

import com.example.flowersproject.entity.products.BouquetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface BouquetRepository extends JpaRepository<BouquetEntity, Long> {

}
