package com.example.flowersproject.services.impl;

import com.example.flowersproject.entity.dto.product.BouquetDTO;
import com.example.flowersproject.entity.products.BouquetEntity;
import com.example.flowersproject.entity.products.ImageEntity;
import com.example.flowersproject.repository.BouquetRepository;
import com.example.flowersproject.repository.ImageRepository;
import com.example.flowersproject.exceptions.ProductNotFoundException;
import com.example.flowersproject.services.BouquetService;
import com.example.flowersproject.services.impl.util.BouquetMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
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
public class BouquetServiceImpl implements BouquetService {

    private final BouquetRepository bouquetRepository;
    private final ImageRepository imageRepository;
    private final ImageServiceImpl imageService;
    private final BouquetMapper bouquetMapper;

    @Override
    public List<BouquetDTO> getAllBouquets() {
        return bouquetRepository.findAll().stream()
                .map(bouquetMapper::toDtoWithFlowerIds)
                .collect(Collectors.toList());
    }

    @Override
    public BouquetDTO getBouquetById(Long bouquetId) {
        return bouquetRepository.findById(bouquetId)
                .map(bouquetMapper::toDtoWithFlowerIds)
                .orElseThrow(() -> new ProductNotFoundException("Flower not found with this id",
                        String.valueOf(bouquetId)));
    }

    @Override
    public ResponseEntity<?>  createBouquet(BouquetDTO bouquetDTO, MultipartFile imageFile) throws IOException {
        if (imageFile == null || imageFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Image file is required for bouquet creation");
        }
        try {
            ImageEntity imageEntity = imageService
                    .uploadImage(imageFile);

            BouquetEntity bouquetEntity = bouquetMapper.toEntityWithFlowerIds(bouquetDTO);
            bouquetEntity.setFlowerIds(bouquetDTO.getFlowerIds());
            bouquetEntity.setImage(imageEntity);

            bouquetRepository.save(bouquetEntity);

            bouquetDTO.setId(bouquetEntity.getId());
            bouquetDTO.setImage(imageEntity);

            return ResponseEntity.status(HttpStatus.CREATED).body(bouquetDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating bouquet - " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?>  updateBouquet(Long bouquetId,
                                            BouquetDTO bouquetDTO,
                                            MultipartFile imageFile) throws IOException {
        try {
            BouquetEntity bouquetEntity = bouquetRepository.findById(bouquetId)
                    .orElseThrow(() -> new EntityNotFoundException("Bouquet not found for id: " + bouquetId));

            bouquetEntity.setName(bouquetDTO.getName());
            bouquetEntity.setDescription(bouquetDTO.getDescription());
            bouquetEntity.setPrice(bouquetDTO.getPrice());
            bouquetEntity.setAvailable(bouquetDTO.getAvailable());

            if (imageFile != null && !imageFile.isEmpty()) {
                ImageEntity oldImage = bouquetEntity.getImage();
                Path imagePath = Paths.get(IMAGE_DIRECTORY).resolve(oldImage.getFileName().toString());
                try {
                    Files.delete(Paths.get(imagePath.toUri()));
                    imageRepository.delete(oldImage);
                } catch (IOException e) {
                    System.out.println(e.getMessage());
                }

                ImageEntity newImage = imageService.uploadImage(imageFile);
                bouquetEntity.setImage(newImage);
            }
            bouquetRepository.save(bouquetEntity);

            return ResponseEntity.status(HttpStatus.OK).body(bouquetMapper.toDtoWithFlowerIds(bouquetEntity));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating bouquet: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> deleteBouquet(Long bouquetId) {
        try {
            if (bouquetId == null || bouquetId <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid bouquetId");
            }

            BouquetEntity flowerEntity = bouquetRepository.findById(bouquetId)
                    .orElseThrow(() -> new EntityNotFoundException("Bouquet not found for id: " + bouquetId));

            ImageEntity image = flowerEntity.getImage();
            try {
                Files.deleteIfExists(Paths.get(IMAGE_DIRECTORY).resolve(image.getFileName()));
                imageRepository.delete(image);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error deleting image for bouquet: " + bouquetId);
            }

            bouquetRepository.deleteById(bouquetId);
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            throw new ProductNotFoundException("Error deleting bouquet: ", e.getMessage());
        }
        return null;
    }


}
