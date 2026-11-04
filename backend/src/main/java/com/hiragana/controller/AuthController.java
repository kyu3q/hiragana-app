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
            // メール確認チェック
            if (!user.getEmailVerified()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "メールアドレスが未確認です。確認メールをご確認ください。");
                errorResponse.put("needsVerification", true);
                return ResponseEntity.status(403).body(errorResponse);
            }

            // Use email from database user object to ensure consistency
            String token = jwtConfig.generateToken(user.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("メールアドレスまたはパスワードが正しくありません");
    }

    /**
     * メールアドレス確認
     */
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("トークンが必要です");
        }

        boolean success = userService.verifyEmail(token);
        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "メールアドレスが確認されました。ログインできます。");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "トークンが無効または期限切れです。確認メールを再送信してください。");
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    /**
     * パスワードリセット依頼
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("メールアドレスが必要です");
        }

        // セキュリティ上、常に成功メッセージを返す
        userService.generateResetTokenAndSendEmail(email);

        Map<String, String> response = new HashMap<>();
        response.put("message", "メールアドレスが存在する場合、リセットメールを送信しました。");
        return ResponseEntity.ok(response);
    }

    /**
     * パスワードリセット
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("トークンが必要です");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("新しいパスワードが必要です");
        }
        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("パスワードは6文字以上で設定してください");
        }

        boolean success = userService.resetPassword(token, newPassword);
        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "パスワードを変更しました。ログインしてください。");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "トークンが無効または期限切れです。もう一度リセットをリクエストしてください。");
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    /**
     * 確認メール再送信
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("メールアドレスが必要です");
        }

        // セキュリティ上、常に成功メッセージを返す
        userService.resendVerificationEmail(email);

        Map<String, String> response = new HashMap<>();
        response.put("message", "確認メールを送信しました。");
        return ResponseEntity.ok(response);
    }
}
