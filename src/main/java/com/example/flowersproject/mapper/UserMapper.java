package com.example.flowersproject.mapper;

import com.example.flowersproject.dto.UserDto;
import com.example.flowersproject.entity.UserEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto map(UserEntity userEntity);

    @InheritInverseConfiguration
    UserEntity map(UserDto userDto);
}
