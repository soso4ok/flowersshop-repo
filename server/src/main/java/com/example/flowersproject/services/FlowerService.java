package com.example.flowersproject.services;

import com.example.flowersproject.dto.product.FlowerDTO;
import com.example.flowersproject.entity.products.ProductEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FlowerService {

    public List<ProductEntity> getAllFlowers();
    public ProductEntity getFlowerById(Integer flowerId);
    public ProductEntity createFlower(FlowerDTO flowerDTO, MultipartFile imageFile) throws IOException;
    public void deleteFlower(Integer flowerId);
    public ProductEntity updateFlower(Integer flowerId, FlowerDTO flowerDto, MultipartFile imageFile) throws IOException ;

}
