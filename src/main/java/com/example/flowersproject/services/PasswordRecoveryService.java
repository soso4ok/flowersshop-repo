package com.example.flowersproject.services;

import com.example.flowersproject.dto.EmailDTO;
import com.example.flowersproject.entity.user.UserEntity;

public interface PasswordRecoveryService {

    void initiatePasswordRecovery(UserEntity user);

}
