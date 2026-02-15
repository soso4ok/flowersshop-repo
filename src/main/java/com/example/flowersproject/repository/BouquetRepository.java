package com.example.flowersproject.repository;

import com.example.flowersproject.entity.product.BouquetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BouquetRepository extends JpaRepository<BouquetEntity, Long>, JpaSpecificationExecutor<BouquetEntity> {

}
