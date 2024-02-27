package com.example.flowersproject.services;

import com.example.flowersproject.entity.dto.FlowerDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FlowerService {

    public ResponseEntity<List<FlowerDTO>> getAllFlowers();
    public ResponseEntity<?> getFlowerById(Long flowerId);
    public ResponseEntity<?> createFlower(FlowerDTO flowerDTO, MultipartFile imageFile) throws IOException;
    public ResponseEntity<?> deleteFlower(Long flowerId);
    public ResponseEntity<?> updateFlower(Long flowerId, FlowerDTO flowerDTO, MultipartFile imageFile) throws IOException ;

}
