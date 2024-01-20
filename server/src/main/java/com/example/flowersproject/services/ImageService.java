package com.example.flowersproject.services;

import com.example.flowersproject.entity.products.ImageEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageService {

    public ImageEntity saveImage(MultipartFile imageFile) throws IOException;

    public void deleteImage(Long imageId) throws IOException;

}
