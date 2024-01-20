package com.example.flowersproject.repository;

import com.example.flowersproject.entity.products.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {

}
