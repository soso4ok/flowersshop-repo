package com.example.flowersproject.services;

import com.example.flowersproject.entity.product.ImageEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageService {

    //ClassPathResource getImageName(String imageName) throws FileNotFoundException;

    public ImageEntity uploadImage(MultipartFile file) throws IOException;

    //public Resource downloadImage(Integer imageId) throws IOException;


}
