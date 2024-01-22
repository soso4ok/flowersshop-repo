package com.example.flowersproject.services;

import com.example.flowersproject.dto.product.FlowerRequest;
import com.example.flowersproject.dto.product.FlowerResponse;
import com.example.flowersproject.entity.products.ProductEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FlowerService {

    public List<FlowerResponse> getAllFlowers();
    public FlowerResponse getFlowerById(Integer flowerId);
    public FlowerResponse createFlower(FlowerRequest flowerRequest, MultipartFile imageFile) throws IOException;
    public void deleteFlower(Integer flowerId);
    public FlowerResponse updateFlower(Integer flowerId, FlowerRequest flowerRequest, MultipartFile imageFile) throws IOException ;

}
