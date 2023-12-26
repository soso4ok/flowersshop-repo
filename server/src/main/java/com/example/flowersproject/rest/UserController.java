package com.example.flowersproject.rest;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {

//    private final UserServiceImpl userService;
//
//    @GetMapping("/{userEmail}")
//    public ResponseEntity<UserEntity> userExists(@PathVariable String userEmail) {
//        return new ResponseEntity<>(userService.userAlreadyExists(userEmail);, HttpStatus.OK);
//
//    }

}
