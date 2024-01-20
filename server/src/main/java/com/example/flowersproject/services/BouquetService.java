package com.example.flowersproject.services;

import com.example.flowersproject.entity.products.BouquetEntity;
import com.example.flowersproject.entity.products.FlowerEntity;
import com.example.flowersproject.repository.BouquetRepository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BouquetService {

    public List<BouquetEntity> getAllBouquets();
    public BouquetEntity getBouquetById(Integer bouquetId);
    public BouquetEntity createBouquet(FlowerEntity bouquetEntity, MultipartFile imageFile) throws IOException;
    public void deleteBouquet(Integer bouquetId);
    public BouquetEntity updateBouquet(Integer bouquetId, BouquetEntity boutquetEntity);


}
