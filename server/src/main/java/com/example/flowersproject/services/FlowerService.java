package com.example.flowersproject.services;

import com.example.flowersproject.dto.product.FlowerDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FlowerService {

    public List<FlowerDTO> getAllFlowers();
    public FlowerDTO getFlowerById(Long flowerId);
    public FlowerDTO createFlower(FlowerDTO flowerDTO, MultipartFile imageFile) throws IOException;
    public ResponseEntity<?> deleteFlower(Long flowerId);
    public FlowerDTO updateFlower(Long flowerId, FlowerDTO flowerDTO, MultipartFile imageFile) throws IOException ;

}
