package com.example.flowersproject.services.impl;

import com.example.flowersproject.entity.ImageEntity;
import com.example.flowersproject.entity.ProductEntity;
import com.example.flowersproject.repository.ProductRepository;
import com.example.flowersproject.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageServiceImpl imageService;

    @Override
    public List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public ProductEntity getProductById(Integer productId) {
        return productRepository.findById(productId).orElse(null);
    }

    @Override
    public ProductEntity createProduct(ProductEntity productEntity,
                                       MultipartFile imageFile) throws IOException {

        if (imageFile != null && !imageFile.isEmpty()){

            ImageEntity imageEntity = imageService.saveImage(imageFile);
            productEntity.setImage(imageEntity);

            return productRepository.save(productEntity);

        }

        return null;

    }

    @Override
    public void deleteProduct(Integer productId) {
        productRepository.deleteById(productId);
    }

    @Override
    public ProductEntity updateProduct(Integer productId, ProductEntity productEntity) {

        ProductEntity originalEntity = productRepository.findById(productId).orElse(null);

        if (originalEntity != null) {
            originalEntity.setTitle(productEntity.getTitle());
            originalEntity.setSubtext(productEntity.getSubtext());
            originalEntity.setPrice(productEntity.getPrice());
            originalEntity.setImage(productEntity.getImage());
            originalEntity.setAvailable(productEntity.isAvailable());

            return productRepository.save(originalEntity);

        }

        return null;

    }
}