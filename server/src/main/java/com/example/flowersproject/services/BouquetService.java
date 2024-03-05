package com.example.flowersproject.services;

import com.example.flowersproject.dto.BouquetDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BouquetService {

    List<BouquetDTO> getAllBouquets();
    BouquetDTO getBouquetById(Long bouquetId);
    ResponseEntity<?>  createBouquet(BouquetDTO bouquetDTO, MultipartFile imageFile) throws IOException;
    ResponseEntity<?> deleteBouquet(Long bouquetId);
    ResponseEntity<?>  updateBouquet(Long bouquetId, BouquetDTO bouquetDTO, MultipartFile imageFile) throws IOException;

}
