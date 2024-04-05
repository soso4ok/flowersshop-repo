package com.example.flowersproject.services.impl;

import com.example.flowersproject.entity.product.ImageEntity;
import com.example.flowersproject.exceptions.ImageNotFoundException;
import com.example.flowersproject.repository.ImageRepository;
import com.example.flowersproject.services.ImageService;
import lombok.AllArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ImageServiceImpl implements ImageService {


    private ImageRepository imageRepository;
    public static String IMAGE_DIRECTORY = "src/main/resources/images";

    public ImageEntity uploadImage(MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        String uniqueFileName = UUID.randomUUID() + "." + FilenameUtils.getExtension(fileName);

        Files.createDirectories(Paths.get(IMAGE_DIRECTORY));

        Path imagePath = Paths.get(IMAGE_DIRECTORY, uniqueFileName);
        Files.copy(file.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        ImageEntity image = new ImageEntity();
        image.setFileName(uniqueFileName);
        return imageRepository.save(image);
    }

    public Resource downloadImage(Long imageId) throws IOException {
        ImageEntity image = imageRepository.findById(imageId)
                .orElseThrow(() -> new FileNotFoundException("Image not found"));
        Path imagePath = Paths.get(IMAGE_DIRECTORY).resolve(image.getFileName());
        Resource resource = new UrlResource(imagePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new FileNotFoundException("Image not found or cannot be read");
        }

        return resource;
    }

    public byte[] getImageFromRepository(Long id) throws IOException {
        ImageEntity image = imageRepository.findById(id)
                .orElseThrow(() -> new ImageNotFoundException("Image not found with id: ", String.valueOf(id)));
        Path imagePath = Paths.get(IMAGE_DIRECTORY, image.getFileName());
        byte[] imageData = Files.readAllBytes(imagePath);
        return imageData;
    }

}
