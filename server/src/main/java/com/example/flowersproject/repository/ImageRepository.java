package com.example.flowersproject.repository;

import com.example.flowersproject.entity.products.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<ImageEntity, Integer> {

    ImageEntity findByImageId(Integer imageId);

}
