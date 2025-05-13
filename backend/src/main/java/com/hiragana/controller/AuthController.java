package com.hiragana.controller;

import com.hiragana.config.JwtConfig;
import com.hiragana.model.User;
import com.hiragana.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtConfig jwtConfig;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("メールアドレスとパスワードが必要です");
        }

        User user = userService.getUserByEmail(email).orElse(null);
        if (user != null && userService.matchesPassword(password, user.getPassword())) {
            String token = jwtConfig.generateToken(email);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("メールアドレスまたはパスワードが正しくありません");
    }
} 