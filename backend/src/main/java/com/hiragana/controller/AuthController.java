package com.hiragana.controller;

import com.hiragana.model.User;
import com.hiragana.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("メールアドレスとパスワードを入力してください");
        }

        Optional<User> userOpt = userService.getUserByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("メールアドレスまたはパスワードが正しくありません");
        }

        User user = userOpt.get();
        // パスワードの照合（ハッシュ化パスワードと平文パスワードの比較）
        if (!userService.matchesPassword(password, user.getPassword())) {
            return ResponseEntity.status(401).body("メールアドレスまたはパスワードが正しくありません");
        }

        // 認証成功時、ユーザー情報を返却
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        // 必要に応じてトークンなども返却可能

        return ResponseEntity.ok(response);
    }
} 