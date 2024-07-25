package com.example.flowersproject.services.impl;

import com.example.flowersproject.dto.BlogDTO;
import com.example.flowersproject.entity.BlogEntity;
import com.example.flowersproject.entity.product.ImageEntity;
import com.example.flowersproject.repository.BlogRepository;
import com.example.flowersproject.services.BlogService;
import com.example.flowersproject.services.mappers.BlogMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final BlogMapper blogMapper;
    private final UserServiceImpl userService;
    private final ImageServiceImpl imageService;

    @Override
    public List<BlogDTO> getAllBlogs() {
        List<BlogEntity> blogs = blogRepository.findAll();
        return blogs.stream()
                .map(blogMapper::blogToDto)
                .collect(Collectors.toList());
    }

    @Override
    public BlogDTO getBlogById(Long id) {
        BlogEntity blog = blogRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
        return blogMapper.blogToDto(blog);
    }

    @Override
    public ResponseEntity<?> createBlog(BlogDTO blogDTO, MultipartFile imageFile) {

        if (userService.userHasPermissionToDoRequest()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to create a flower.");
        }

        if (imageFile == null || imageFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Image file is required for flower creation.");
        }

        try {
        ImageEntity imageEntity = imageService.uploadImage(imageFile);

        BlogEntity blog = blogMapper.dtoToBlog(blogDTO);
        blog.setImage(imageEntity);
            System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa here "+blogDTO);

        blogRepository.save(blog);

        blogDTO.setImage(imageEntity);
            return ResponseEntity.status(HttpStatus.CREATED).body(blogDTO);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while processing the image.");
        }
    }

    @Override
    public BlogDTO updateBlog(Long id, BlogDTO blogDTO) {
        BlogEntity existingBlog = blogRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);

        existingBlog.setTitle(blogDTO.getTitle());
        existingBlog.setContent(blogDTO.getContent());

        BlogEntity updatedBlog = blogRepository.save(existingBlog);
        return blogMapper.blogToDto(updatedBlog);
    }

    @Override
    public void deleteBlog(Long id) {
        BlogEntity blog = blogRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
        blogRepository.delete(blog);
    }
}
