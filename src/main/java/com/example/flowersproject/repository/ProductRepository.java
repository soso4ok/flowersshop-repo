package com.example.flowersproject.repository;

import com.example.flowersproject.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {



}
