package com.example.flowersproject.repository;

import com.example.flowersproject.entity.product.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<ImageEntity, Long> {

    ImageEntity findByImageId(Integer imageId);

}
