package com.example.flowersproject.services.impl;

import com.example.flowersproject.entity.dto.product.FlowerDTO;
import com.example.flowersproject.entity.products.FlowerEntity;
import com.example.flowersproject.entity.products.ImageEntity;
import com.example.flowersproject.repository.FlowerRepository;
import com.example.flowersproject.repository.ImageRepository;
import com.example.flowersproject.rest.exceptions.ImageNotFoundException;
import com.example.flowersproject.rest.exceptions.ProductNotFoundException;
import com.example.flowersproject.services.FlowerService;
import com.example.flowersproject.services.impl.util.FlowerMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.flowersproject.services.impl.ImageServiceImpl.IMAGE_DIRECTORY;

@Service
@AllArgsConstructor
public class FlowerServiceImpl implements FlowerService {

    private final FlowerRepository flowerRepository;
    private final ImageRepository imageRepository;
    private final ImageServiceImpl imageService;
    private final FlowerMapper flowerMapper;

    @Override
    public List<FlowerDTO> getAllFlowers() {
        return flowerRepository.findAll().stream()
                .map(flowerEntity -> {
                    FlowerDTO flowerDTO = flowerMapper.toDto(flowerEntity);
                    return flowerDTO;
                })
                .collect(Collectors.toList());
        }

    @Override
    public FlowerDTO getFlowerById(Long flowerId) {
        return flowerRepository.findById(flowerId)
                .map(flowerMapper::toDto)
                .orElseThrow(() -> new ProductNotFoundException("Flower not found with this id", String.valueOf(flowerId)));
    }


    @Override
    public FlowerDTO createFlower(FlowerDTO flowerDTO, MultipartFile imageFile) throws IOException {

        if (imageFile == null || imageFile.isEmpty()) {
            throw new ImageNotFoundException("Image file is required for flower creation.", imageFile.getName());
        }
            ImageEntity imageEntity = imageService.uploadImage(imageFile);
            FlowerEntity flowerEntity = flowerMapper.toEntity(flowerDTO);

            flowerEntity.setImage(imageEntity);

            flowerRepository.save(flowerEntity);

            flowerDTO.setImage(imageEntity);
            return flowerDTO;
    }

    @Override
    public FlowerDTO updateFlower(Long flowerId,
                                  FlowerDTO flowerDTO,
                                  MultipartFile imageFile) throws IOException {

        if (flowerId == null || flowerId <= 0) {
            throw new IllegalArgumentException("Invalid flowerId");
        }

        FlowerEntity flowerEntity = flowerRepository.findById(flowerId)
                .orElseThrow(() -> new EntityNotFoundException("Flower not found for id: " + flowerId));


        if (imageFile != null && !imageFile.isEmpty()) {
            ImageEntity oldImage = flowerEntity.getImage();
            Path imagePath = Paths.get(IMAGE_DIRECTORY).resolve(oldImage.getFileName().toString());
            try {
                Files.delete(Paths.get(imagePath.toUri()));
                imageRepository.delete(oldImage);
            } catch (IOException e) {

            }

            ImageEntity newImage = imageService.uploadImage(imageFile);

            flowerEntity.setImage(newImage);

            flowerRepository.save(flowerEntity);

            return flowerMapper.toDto(flowerEntity);
        }

        return null;

    }

    @Override
    public ResponseEntity<?> deleteFlower(Long flowerId) {
        try {
            if (flowerId == null || flowerId <= 0) {
                throw new IllegalArgumentException("Invalid flowerId");
            }

            FlowerEntity flowerEntity = flowerRepository.findById(flowerId)
                    .orElseThrow(() -> new EntityNotFoundException("Flower not found for id: " + flowerId));

            ImageEntity image = flowerEntity.getImage();
            try {
                Files.deleteIfExists(Paths.get(IMAGE_DIRECTORY).resolve(image.getFileName()));
                imageRepository.delete(image);
            } catch (IOException e) {
                throw new ProductNotFoundException("Error deleting image for flower: ", e.getMessage());
            }

            flowerRepository.deleteById(flowerId);
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            throw new ProductNotFoundException("Error deleting flower: ", e.getMessage());
        }
        return null;
    }


}