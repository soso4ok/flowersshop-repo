package com.example.flowersproject.repository;

import com.example.flowersproject.entity.product.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.stereotype.Repository;

@NoRepositoryBean
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
}
