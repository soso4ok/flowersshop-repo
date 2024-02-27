package com.example.flowersproject.repository;

import com.example.flowersproject.entity.product.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
}
