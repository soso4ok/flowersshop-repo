package com.example.flowersproject.services.impl;

import com.example.flowersproject.dto.FlowerDTO;
import com.example.flowersproject.entity.product.FlowerEntity;
import com.example.flowersproject.entity.product.ImageEntity;
import com.example.flowersproject.repository.FlowerRepository;
import com.example.flowersproject.repository.ImageRepository;
import com.example.flowersproject.services.FlowerService;
import com.example.flowersproject.services.mappers.FlowerMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserServiceImpl userService;

    @Override
    public ResponseEntity<List<FlowerDTO>> getAllFlowers() {
        List<FlowerDTO> flowerDTOs =  flowerRepository.findAll().stream()
                .map(flowerEntity -> {
                    FlowerDTO flowerDTO = flowerMapper.flowerToDto(flowerEntity);
                    return flowerDTO;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(flowerDTOs);
        }

    @Override
    public ResponseEntity<?> getFlowerById(Long orderId) {
        return flowerRepository.findById(orderId)
                .map(flowerMapper::flowerToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @Override
    public ResponseEntity<?> createFlower(FlowerDTO flowerDTO,
                                          MultipartFile imageFile) {

        if (userService.userHasPermissionToDoRequest()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to create a flower.");
        }
        if (imageFile == null || imageFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Image file is required for flower creation.");
        }

        try {
            ImageEntity imageEntity = imageService.uploadImage(imageFile);
            FlowerEntity flowerEntity = flowerMapper.flowerToEntity(flowerDTO);
            flowerEntity.setImage(imageEntity);

            flowerRepository.save(flowerEntity);

            flowerDTO.setImage(imageEntity);
            return ResponseEntity.status(HttpStatus.CREATED).body(flowerDTO);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while processing the image.");
        }
    }


    @Override
    public ResponseEntity<?> updateFlower(Long flowerId,
                                          FlowerDTO flowerDTO,
                                          MultipartFile imageFile) throws IOException {

        if (flowerId == null || flowerId <= 0) {
            return ResponseEntity.badRequest().body("Invalid flowerId");
        }
        if (userService.userHasPermissionToDoRequest()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to create a flower.");
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
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting image for flower");
            }

            ImageEntity newImage = imageService.uploadImage(imageFile);
            flowerEntity.setImage(newImage);
        }

        flowerRepository.save(flowerEntity);

        return ResponseEntity.ok(flowerMapper.flowerToDto(flowerEntity));
    }


    @Override
    public ResponseEntity<?> deleteFlower(Long flowerId) {

        if (flowerId == null || flowerId <= 0) {
            return ResponseEntity.badRequest().body("Invalid flowerId");
        }
        if (userService.userHasPermissionToDoRequest()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to delete this flower");
        }

        try {
            FlowerEntity flowerEntity = flowerRepository.findById(flowerId)
                    .orElseThrow(() -> new EntityNotFoundException("Flower not found for id: " + flowerId));

            ImageEntity image = flowerEntity.getImage();
            try {
                Files.deleteIfExists(Paths.get(IMAGE_DIRECTORY).resolve(image.getFileName()));
                imageRepository.delete(image);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting image for flower");
            }

            flowerRepository.deleteById(flowerId);

            return ResponseEntity.ok("Flower deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting flower: " + e.getMessage());
        }
    }








}