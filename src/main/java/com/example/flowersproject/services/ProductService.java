package com.example.flowersproject.services;

import com.example.flowersproject.entity.ProductEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {

    public List<ProductEntity> getAllProducts();
    public ProductEntity  getProductById(Integer productId);
    public ProductEntity createProduct(ProductEntity productEntity, MultipartFile imageFile) throws IOException;
    public void deleteProduct(Integer productId);
    public ProductEntity updateProduct(Integer productId, ProductEntity productEntity);

}
