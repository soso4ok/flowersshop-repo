package com.example.flowersproject.repository;

import com.example.flowersproject.entity.products.FlowerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlowerRepository extends ProductRepository {}
