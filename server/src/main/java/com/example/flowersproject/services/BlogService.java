package com.example.flowersproject.services;

import com.example.flowersproject.dto.BlogDTO;

import java.util.List;

public interface BlogService {

    List<BlogDTO> getAllBlogs();

    BlogDTO getBlogById(Long id);

    BlogDTO createBlog(BlogDTO blogDTO);

    public BlogDTO updateBlog(Long id, BlogDTO blogDTO);

    void deleteBlog(Long id);

}
