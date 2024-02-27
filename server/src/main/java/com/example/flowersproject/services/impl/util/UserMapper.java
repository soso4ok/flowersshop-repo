package com.example.flowersproject.services.impl.util;

import com.example.flowersproject.entity.dto.UserDTO;
import com.example.flowersproject.entity.user.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "id", target = "id")
    UserDTO userEntityToDto(UserEntity userEntity);

    @Mapping(source = "id", target = "id")
    UserEntity userDtoToEntity(UserDTO userDTO);

}
