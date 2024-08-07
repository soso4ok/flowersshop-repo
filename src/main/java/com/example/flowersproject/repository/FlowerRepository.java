package com.example.flowersproject.repository;

import com.example.flowersproject.entity.product.FlowerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlowerRepository extends JpaRepository<FlowerEntity, Long> {



}
