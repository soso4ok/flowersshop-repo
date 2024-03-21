package com.example.flowersproject.services.mappers;

import com.example.flowersproject.dto.BlogDTO;
import com.example.flowersproject.entity.BlogEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface BlogMapper {

    @Mappings({
            @Mapping(source = "id", target = "id"),
            @Mapping(source = "title", target = "title"),
            @Mapping(source = "content", target = "content"),
            @Mapping(source = "createdAt", target = "createdAt")
    })
    BlogDTO blogToDto(BlogEntity blog);

    @Mappings({
            @Mapping(source = "title", target = "title"),
            @Mapping(source = "content", target = "content"),
            @Mapping(source = "createdAt", target = "createdAt")
    })
    BlogEntity dtoToBlog(BlogDTO blogDTO);
}
