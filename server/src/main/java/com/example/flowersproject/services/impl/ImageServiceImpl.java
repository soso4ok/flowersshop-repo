package com.example.flowersproject.services.impl;

import com.example.flowersproject.entity.products.ImageEntity;
import com.example.flowersproject.repository.ImageRepository;
import com.example.flowersproject.services.ImageService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ImageServiceImpl implements ImageService {

    private ImageRepository imageRepository;

    private final String IMAGE_DIRECTORY = "src/main/resources/images";



    @Override
    public ImageEntity saveImage(MultipartFile imageFile) throws IOException {

        String fileName = UUID.randomUUID()
                + "_" + imageFile.getOriginalFilename();

        Files.copy(imageFile.getInputStream(),
                Paths.get(IMAGE_DIRECTORY).resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING);


        ImageEntity imageEntity = new ImageEntity();
        imageEntity.setFileName(fileName);

        return imageRepository.save(imageEntity);

    }

    @Override
    public void deleteImage(Long imageId) throws IOException {

        ImageEntity imageEntity = imageRepository.findById(imageId).orElse(null);

        if (imageId != null) {
            Files.deleteIfExists(Paths.get(IMAGE_DIRECTORY).resolve(imageEntity.getFileName()));
            imageRepository.deleteById(imageId);
        }

    }
}
