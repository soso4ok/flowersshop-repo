package com.example.flowersproject.services;

import com.example.flowersproject.entity.dto.product.BouquetDTO;
import com.example.flowersproject.entity.dto.product.FlowerDTO;
import com.example.flowersproject.entity.products.BouquetEntity;
import com.example.flowersproject.entity.products.FlowerEntity;
import com.example.flowersproject.repository.BouquetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BouquetService {

    public List<BouquetDTO> getAllBouquets();
    public BouquetDTO getBouquetById(Long bouquetId);
    public ResponseEntity<?>  createBouquet(BouquetDTO bouquetDTO, MultipartFile imageFile) throws IOException;
    public ResponseEntity<?> deleteBouquet(Long bouquetId);
    public ResponseEntity<?>  updateBouquet(Long bouquetId, BouquetDTO bouquetDTO, MultipartFile imageFile) throws IOException;

}
