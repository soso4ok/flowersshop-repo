package com.example.flowersproject.services.impl;

import com.example.flowersproject.repository.UserRepository;
import com.example.flowersproject.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;

    @Override
    public boolean userAlreadyExists(String email) {
        return repository.existsByEmail(email);
    }


}
