package com.example.flowersproject.repository;

import com.example.flowersproject.entity.product.FlowerEntity;
import com.example.flowersproject.entity.product.FlowerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlowerRepository extends JpaRepository<FlowerEntity, Long>, JpaSpecificationExecutor<FlowerEntity> {

    List<FlowerEntity> findAllByFlowerType(FlowerType flowerType);

}
