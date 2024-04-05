package com.example.flowersproject.services;

import com.example.flowersproject.dto.BlogDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BlogService {

    List<BlogDTO> getAllBlogs();

    BlogDTO getBlogById(Long id);

    public ResponseEntity<?> createBlog(BlogDTO blogDTO, MultipartFile imageFile);

    public BlogDTO updateBlog(Long id, BlogDTO blogDTO);

    void deleteBlog(Long id);

}
