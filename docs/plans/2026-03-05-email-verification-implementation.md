# メール認証システム実装計画

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目標:** ひらがなアプリにメール確認とパスワードリセット機能を実装する

**アーキテクチャ:** Spring Boot JavaMailSender + Gmail SMTPを使用。Userモデルにメール確認フィールドを追加し、トークンベースの確認・リセットフローを実装。フロントエンドはReactで新しいページ（確認、リセット）を追加。

**技術スタック:** Java 11, Spring Boot 2.7.18, JPA, H2 Database, React, JavaMailSender, JWT

---

## Task 1: pom.xmlにメール送信依存関係を追加

**Files:**
- Modify: `backend/pom.xml:78` (dependenciesセクションの最後)

**Step 1: メール送信依存関係を追加**

`backend/pom.xml`の`</dependencies>`タグの直前（78行目付近）に以下を追加:

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-mail</artifactId>
        </dependency>
```

**Step 2: ビルドが通ることを確認**

Run: `cd backend && ./mvnw clean compile -DskipTests`
Expected: BUILD SUCCESS

**Step 3: コミット**

```bash
git add backend/pom.xml
git commit -m "build: spring-boot-starter-mailの依存関係を追加

メール送信機能のためにJavaMailSenderを使用可能にする

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Userモデルにメール確認フィールドを追加

**Files:**
- Modify: `backend/src/main/java/com/hiragana/model/User.java:22-28`

**Step 1: Userエンティティに新しいフィールドを追加**

`User.java`の`email`フィールドの後（22行目付近）に以下のフィールドを追加:

```java
    @Column(nullable = false)
    private String email;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Column(name = "verification_token", length = 255)
    private String verificationToken;

    @Column(name = "token_expiry")
    private LocalDateTime tokenExpiry;

    @Column(name = "reset_token", length = 255)
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
```

**注意:** `spring.jpa.hibernate.ddl-auto=update`が設定されているため、アプリ起動時に自動的にカラムが追加されます。

**Step 2: アプリケーションが起動することを確認**

Run: `cd backend && ./mvnw spring-boot:run`
Expected: アプリケーションが起動し、H2データベースにカラムが追加される
確認後、Ctrl+Cで停止

**Step 3: コミット**

```bash
git add backend/src/main/java/com/hiragana/model/User.java
git commit -m "feat: Userモデルにメール確認フィールドを追加

- emailVerified: メール確認済みフラグ
- verificationToken: メール確認用トークン
- tokenExpiry: 確認トークン有効期限
- resetToken: パスワードリセット用トークン
- resetTokenExpiry: リセットトークン有効期限

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: application.propertiesにメール設定を追加

**Files:**
- Modify: `backend/src/main/resources/application.properties:59`

**Step 1: メール送信設定を追加**

`application.properties`の最後に以下を追加:

```properties
# メール送信設定（Gmail SMTP）
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${GMAIL_USERNAME:}
spring.mail.password=${GMAIL_APP_PASSWORD:}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# フロントエンドURL（確認リンク生成用）
app.frontend.url=${FRONTEND_URL:http://localhost:5173}
```

**注意:** 環境変数が設定されていない場合はデフォルト値を使用します。`GMAIL_USERNAME`と`GMAIL_APP_PASSWORD`は実際の使用時に設定が必要です。

**Step 2: コミット**

```bash
git add backend/src/main/resources/application.properties
git commit -m "config: Gmail SMTP設定を追加

メール送信のための設定を追加。環境変数で設定可能。
- spring.mail.* でGmail SMTP設定
- app.frontend.url で確認リンク生成用URL設定

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: EmailService実装

**Files:**
- Create: `backend/src/main/java/com/hiragana/service/EmailService.java`

**Step 1: EmailServiceクラスを作成**

新しいファイル `backend/src/main/java/com/hiragana/service/EmailService.java` を作成:

```java
package com.hiragana.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    /**
     * メール確認用のメールを送信
     *
     * @param to 送信先メールアドレス
     * @param token 確認用トークン
     */
    public void sendVerificationEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("【ひらがなアプリ】メールアドレスの確認");

        String verificationUrl = frontendUrl + "/verify?token=" + token;
        String text = String.format(
            "こんにちは、\n\n" +
            "ひらがなアプリにご登録いただきありがとうございます。\n\n" +
            "以下のリンクをクリックして、メールアドレスを確認してください。\n" +
            "このリンクは24時間有効です。\n\n" +
            "%s\n\n" +
            "もしこのメールに心当たりがない場合は、このメールを無視してください。\n\n" +
            "ひらがなアプリチーム",
            verificationUrl
        );

        message.setText(text);
        mailSender.send(message);
    }

    /**
     * パスワードリセット用のメールを送信
     *
     * @param to 送信先メールアドレス
     * @param token リセット用トークン
     */
    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("【ひらがなアプリ】パスワードのリセット");

        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String text = String.format(
            "こんにちは、\n\n" +
            "パスワードのリセットがリクエストされました。\n\n" +
            "以下のリンクをクリックして、新しいパスワードを設定してください。\n" +
            "このリンクは1時間有効です。\n\n" +
            "%s\n\n" +
            "もしこのリクエストに心当たりがない場合は、このメールを無視してください。\n\n" +
            "ひらがなアプリチーム",
            resetUrl
        );

        message.setText(text);
        mailSender.send(message);
    }
}
```

**Step 2: コミット**

```bash
git add backend/src/main/java/com/hiragana/service/EmailService.java
git commit -m "feat: EmailServiceを実装

JavaMailSenderを使用してメール送信機能を実装
- sendVerificationEmail: メール確認用メール送信
- sendPasswordResetEmail: パスワードリセット用メール送信

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: UserServiceにトークン生成・検証メソッドを追加

**Files:**
- Modify: `backend/src/main/java/com/hiragana/service/UserService.java:71`

**Step 1: 必要なインポートを追加**

`UserService.java`の先頭のインポート文に以下を追加:

```java
import java.time.LocalDateTime;
import java.util.UUID;
```

**Step 2: EmailServiceをインジェクション**

`UserService.java`の`passwordEncoder`フィールドの後に追加:

```java
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;
```

**Step 3: トークン生成・検証メソッドを追加**

`UserService.java`の`matchesPassword`メソッドの後（71行目以降）に以下を追加:

```java
    /**
     * メール確認用トークンを生成してメールを送信
     *
     * @param user ユーザー
     */
    public void generateVerificationTokenAndSendEmail(User user) {
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), token);
    }

    /**
     * メール確認トークンを検証してアカウントを有効化
     *
     * @param token 確認トークン
     * @return 成功した場合true
     */
    public boolean verifyEmail(String token) {
        Optional<User> userOpt = userRepository.findByVerificationToken(token);
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();

        // トークンの有効期限をチェック
        if (user.getTokenExpiry() == null || LocalDateTime.now().isAfter(user.getTokenExpiry())) {
            return false;
        }

        // アカウントを有効化
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);

        return true;
    }

    /**
     * パスワードリセット用トークンを生成してメールを送信
     *
     * @param email メールアドレス
     */
    public void generateResetTokenAndSendEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // セキュリティ上、存在しないメールでも成功として扱う
            return;
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    /**
     * リセットトークンを検証してパスワードを更新
     *
     * @param token リセットトークン
     * @param newPassword 新しいパスワード
     * @return 成功した場合true
     */
    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findByResetToken(token);
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();

        // トークンの有効期限をチェック
        if (user.getResetTokenExpiry() == null || LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            return false;
        }

        // パスワードを更新
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return true;
    }

    /**
     * 確認メールを再送信
     *
     * @param email メールアドレス
     */
    public void resendVerificationEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // セキュリティ上、存在しないメールでも成功として扱う
            return;
        }

        User user = userOpt.get();

        // 既に確認済みの場合は何もしない
        if (user.getEmailVerified()) {
            return;
        }

        // 新しいトークンを生成して送信
        generateVerificationTokenAndSendEmail(user);
    }
```

**Step 4: コミット**

```bash
git add backend/src/main/java/com/hiragana/service/UserService.java
git commit -m "feat: UserServiceにトークン生成・検証メソッドを追加

- generateVerificationTokenAndSendEmail: 確認トークン生成・送信
- verifyEmail: メール確認トークン検証
- generateResetTokenAndSendEmail: リセットトークン生成・送信
- resetPassword: パスワードリセット
- resendVerificationEmail: 確認メール再送信

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: UserRepositoryに検索メソッドを追加

**Files:**
- Modify: `backend/src/main/java/com/hiragana/repository/UserRepository.java`

**Step 1: UserRepositoryを確認**

現在の`UserRepository.java`を確認します。

**Step 2: 検索メソッドを追加**

`UserRepository.java`に以下のメソッドを追加:

```java
package com.hiragana.repository;

import com.hiragana.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByVerificationToken(String verificationToken);
    Optional<User> findByResetToken(String resetToken);
}
```

**Step 3: コミット**

```bash
git add backend/src/main/java/com/hiragana/repository/UserRepository.java
git commit -m "feat: UserRepositoryにトークン検索メソッドを追加

- findByVerificationToken: 確認トークンで検索
- findByResetToken: リセットトークンで検索

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: UserServiceのcreateUserメソッドを修正

**Files:**
- Modify: `backend/src/main/java/com/hiragana/service/UserService.java:21-42`

**Step 1: createUserメソッドを修正**

`createUser`メソッドを以下のように修正し、登録時にメール確認フローを開始:

```java
    public User createUser(User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new RuntimeException("メールアドレスは必須です");
        }
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new RuntimeException("ユーザー名は必須です");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("パスワードは必須です");
        }

        // メールアドレスの形式チェック
        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new RuntimeException("メールアドレスの形式が正しくありません");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("このユーザー名は既に使用されています");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("このメールアドレスは既に登録されています");
        }

        // パスワードをハッシュ化
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // メール未確認状態で保存
        user.setEmailVerified(false);
        User savedUser = userRepository.save(user);

        // 確認メールを送信
        generateVerificationTokenAndSendEmail(savedUser);

        return savedUser;
    }
```

**Step 2: コミット**

```bash
git add backend/src/main/java/com/hiragana/service/UserService.java
git commit -m "feat: ユーザー登録時にメール確認フローを開始

- メールアドレス形式チェック追加
- emailVerified=falseで保存
- 確認メール自動送信

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: AuthControllerのloginメソッドを修正

**Files:**
- Modify: `backend/src/main/java/com/hiragana/controller/AuthController.java:23-43`

**Step 1: loginメソッドにメール確認チェックを追加**

`login`メソッドを以下のように修正:

```java
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
```

**Step 2: コミット**

```bash
git add backend/src/main/java/com/hiragana/controller/AuthController.java
git commit -m "feat: ログイン時にメール確認状態をチェック

未確認ユーザーはログイン不可。403エラーとneedsVerificationフラグを返す。

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: AuthControllerに新しいエンドポイントを追加

**Files:**
- Modify: `backend/src/main/java/com/hiragana/controller/AuthController.java:44`

**Step 1: 新しいエンドポイントを追加**

`AuthController.java`の`login`メソッドの後に以下を追加:

```java
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
        if (newPassword.length() < 8) {
            return ResponseEntity.badRequest().body("パスワードは8文字以上で設定してください");
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
```

**Step 2: コミット**

```bash
git add backend/src/main/java/com/hiragana/controller/AuthController.java
git commit -m "feat: メール確認とパスワードリセットのエンドポイントを追加

- POST /api/auth/verify-email: メール確認
- POST /api/auth/forgot-password: パスワードリセット依頼
- POST /api/auth/reset-password: パスワードリセット
- POST /api/auth/resend-verification: 確認メール再送信

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: SecurityConfigでエンドポイントを許可

**Files:**
- Modify: `backend/src/main/java/com/hiragana/config/SecurityConfig.java`

**Step 1: SecurityConfigを確認**

現在の`SecurityConfig.java`を読み取ります。

**Step 2: 新しいエンドポイントを許可リストに追加**

`SecurityConfig.java`の`configure`メソッド（または同等の設定）で、以下のエンドポイントを認証なしでアクセス可能にします:

- `/api/auth/verify-email`
- `/api/auth/forgot-password`
- `/api/auth/reset-password`
- `/api/auth/resend-verification`

通常は`.antMatchers()`を使用して以下のように設定:

```java
.antMatchers("/api/auth/**").permitAll()
```

既に`/api/auth/**`が許可されている場合は変更不要です。

**Step 3: 設定を確認してコミット**

```bash
git add backend/src/main/java/com/hiragana/config/SecurityConfig.java
git commit -m "config: 新しい認証エンドポイントをセキュリティ設定で許可

メール確認・リセット関連エンドポイントを認証なしでアクセス可能に

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: バックエンドの動作確認

**Files:**
- None (テスト実行)

**Step 1: アプリケーションを起動**

Run: `cd backend && ./mvnw spring-boot:run`
Expected: アプリケーションが正常に起動

**Step 2: エンドポイントをテスト（curl）**

1. ユーザー登録をテスト:

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

Expected: ユーザーが作成され、emailVerified=falseで保存される

2. ログインを試みる:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected: 403エラーとneedsVerification=trueが返される

**注意:** 実際のメール送信テストは環境変数（GMAIL_USERNAME、GMAIL_APP_PASSWORD）が設定されている場合のみ可能です。

**Step 3: テストが成功したらアプリケーションを停止**

Ctrl+Cで停止

**Step 4: コミット不要**

このステップはテストのみなのでコミットは不要です。

---

## Task 12: フロントエンド - VerifyEmailページを作成

**Files:**
- Create: `frontend/src/pages/VerifyEmail.jsx`

**Step 1: VerifyEmailページを作成**

新しいファイル `frontend/src/pages/VerifyEmail.jsx` を作成:

```jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('トークンが見つかりません。');
        return;
      }

      try {
        const response = await apiClient.post(`/api/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data.message || 'メールアドレスが確認されました。');
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.error ||
          'メールアドレスの確認に失敗しました。'
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleResendEmail = async () => {
    const email = prompt('メールアドレスを入力してください:');
    if (!email) return;

    try {
      await apiClient.post('/api/auth/resend-verification', { email });
      alert('確認メールを再送信しました。');
    } catch (error) {
      alert('メールの送信に失敗しました。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          メール確認
        </h1>

        {status === 'verifying' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">確認中...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <p className="text-lg text-gray-700">{message}</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              ログインする
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-red-500 text-6xl mb-4">✗</div>
              <p className="text-lg text-gray-700 mb-4">{message}</p>
            </div>
            <button
              onClick={handleResendEmail}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 mb-3"
            >
              確認メールを再送信
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              ログイン画面に戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
```

**Step 2: コミット**

```bash
git add frontend/src/pages/VerifyEmail.jsx
git commit -m "feat: メール確認ページを作成

URLパラメータからトークンを取得し、バックエンドで確認。
- 確認中、成功、エラーの3状態を表示
- 再送信機能付き

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 13: フロントエンド - ForgotPasswordページを作成

**Files:**
- Create: `frontend/src/pages/ForgotPassword.jsx`

**Step 1: ForgotPasswordページを作成**

新しいファイル `frontend/src/pages/ForgotPassword.jsx` を作成:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await apiClient.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message || 'リセットメールを送信しました。');
      setEmail('');
    } catch (err) {
      setError('メールの送信に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-600">
          パスワードを忘れた
        </h1>
        <p className="text-center text-gray-600 mb-6">
          登録したメールアドレスを入力してください
        </p>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? '送信中...' : 'リセットメールを送信'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:underline"
          >
            ログイン画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
```

**Step 2: コミット**

```bash
git add frontend/src/pages/ForgotPassword.jsx
git commit -m "feat: パスワードリセット依頼ページを作成

メールアドレスを入力してリセットメールを送信。
成功・エラーメッセージを表示。

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 14: フロントエンド - ResetPasswordページを作成

**Files:**
- Create: `frontend/src/pages/ResetPassword.jsx`

**Step 1: ResetPasswordページを作成**

新しいファイル `frontend/src/pages/ResetPassword.jsx` を作成:

```jsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }

    if (newPassword.length < 8) {
      setError('パスワードは8文字以上で設定してください。');
      return;
    }

    const token = searchParams.get('token');
    if (!token) {
      setError('トークンが見つかりません。');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/api/auth/reset-password', {
        token,
        newPassword,
      });
      alert(response.data.message || 'パスワードを変更しました。');
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'パスワードのリセットに失敗しました。'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-600">
          パスワードリセット
        </h1>
        <p className="text-center text-gray-600 mb-6">
          新しいパスワードを入力してください
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">新しいパスワード</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="8文字以上"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">パスワード確認</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="もう一度入力"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? 'リセット中...' : 'パスワードを変更'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:underline"
          >
            ログイン画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
```

**Step 2: コミット**

```bash
git add frontend/src/pages/ResetPassword.jsx
git commit -m "feat: パスワードリセットページを作成

URLトークンを使用して新しいパスワードを設定。
パスワード確認入力とバリデーション付き。

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 15: フロントエンド - ルーティングに新しいページを追加

**Files:**
- Modify: `frontend/src/App.jsx` (または該当するルーティング設定ファイル)

**Step 1: 既存のルーティング設定を確認**

`App.jsx`または`main.jsx`、`router.jsx`などのルーティング設定ファイルを確認します。

**Step 2: 新しいルートを追加**

React Routerを使用している場合、以下のようにルートを追加:

```jsx
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// ルート設定に追加
<Route path="/verify" element={<VerifyEmail />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
```

**Step 3: コミット**

```bash
git add frontend/src/App.jsx
git commit -m "feat: メール確認・リセット関連のルートを追加

- /verify: メール確認ページ
- /forgot-password: パスワードリセット依頼ページ
- /reset-password: パスワードリセットページ

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 16: フロントエンド - ログイン画面にリンクを追加

**Files:**
- Modify: `frontend/src/pages/Login.jsx` (または該当するログインコンポーネント)

**Step 1: ログインコンポーネントを確認**

既存のログインページファイルを読み取ります。

**Step 2: 「パスワードを忘れた」リンクを追加**

ログインフォームの下に以下を追加:

```jsx
<div className="mt-4 text-center">
  <button
    type="button"
    onClick={() => navigate('/forgot-password')}
    className="text-indigo-600 hover:underline"
  >
    パスワードを忘れた方はこちら
  </button>
</div>
```

**Step 3: メール未確認エラーの処理を追加**

ログインエラー処理で、`needsVerification`フラグをチェックし、確認メール再送信オプションを提供:

```jsx
// ログイン処理のcatchブロックで
if (error.response?.data?.needsVerification) {
  setError('メールアドレスが未確認です。確認メールをご確認ください。');
  // 再送信ボタンを表示するなど
}
```

**Step 4: コミット**

```bash
git add frontend/src/pages/Login.jsx
git commit -m "feat: ログイン画面にパスワードリセットリンクと未確認処理を追加

- 「パスワードを忘れた」リンク追加
- メール未確認エラー時の処理追加

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 17: フロントエンド - 登録画面に確認メッセージを追加

**Files:**
- Modify: `frontend/src/pages/Register.jsx` (または該当する登録コンポーネント)

**Step 1: 登録コンポーネントを確認**

既存の登録ページファイルを読み取ります。

**Step 2: 登録成功後のメッセージを変更**

登録成功時に以下のようなメッセージを表示:

```jsx
// 登録成功後
alert('登録が完了しました。確認メールを送信しましたので、メールをご確認ください。');
// または専用の成功画面に遷移
```

**Step 3: コミット**

```bash
git add frontend/src/pages/Register.jsx
git commit -m "feat: 登録成功時に確認メール送信メッセージを追加

ユーザーにメール確認が必要であることを明確に通知

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 18: フロントエンドの動作確認

**Files:**
- None (テスト実行)

**Step 1: フロントエンドを起動**

Run: `cd frontend && npm run dev`
Expected: 開発サーバーが起動（通常 http://localhost:5173）

**Step 2: 手動テスト**

ブラウザで以下をテスト:

1. `/register` - ユーザー登録画面
   - 登録後、確認メッセージが表示されることを確認

2. `/login` - ログイン画面
   - 「パスワードを忘れた」リンクが表示されることを確認
   - 未確認ユーザーでログインすると、エラーメッセージが表示されることを確認

3. `/forgot-password` - パスワードリセット依頼
   - メールアドレスを入力して送信できることを確認

4. `/verify?token=dummy` - メール確認画面
   - エラーメッセージ（トークン無効）が表示されることを確認

5. `/reset-password?token=dummy` - パスワードリセット画面
   - 新パスワードを入力できることを確認

**Step 3: コミット不要**

このステップはテストのみなのでコミットは不要です。

---

## Task 19: README更新または環境変数設定ドキュメント作成

**Files:**
- Modify: `README.md` または Create: `docs/EMAIL_SETUP.md`

**Step 1: メール設定に関するドキュメントを作成**

新しいファイル `docs/EMAIL_SETUP.md` を作成:

```markdown
# メール送信設定ガイド

## Gmail SMTPの設定方法

### 1. Gmailアカウントで2段階認証を有効化

1. [Googleアカウント](https://myaccount.google.com/)にアクセス
2. 「セキュリティ」タブを選択
3. 「2段階認証プロセス」を有効化

### 2. アプリパスワードを生成

1. [アプリパスワード](https://myaccount.google.com/apppasswords)にアクセス
2. 「アプリを選択」→「メール」を選択
3. 「デバイスを選択」→「その他（名前を入力）」→「ひらがなアプリ」と入力
4. 「生成」をクリック
5. 表示された16文字のパスワードをコピー（例: `abcd efgh ijkl mnop`）

### 3. 環境変数を設定

#### 開発環境（ローカル）

`backend`ディレクトリに`.env`ファイルを作成（またはシェル環境変数として設定）:

```bash
export GMAIL_USERNAME=your-email@gmail.com
export GMAIL_APP_PASSWORD=abcdefghijklmnop
export FRONTEND_URL=http://localhost:5173
```

#### 本番環境

環境変数を設定:

```bash
GMAIL_USERNAME=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
FRONTEND_URL=https://your-app-domain.com
```

### 4. 動作確認

1. バックエンドを起動: `cd backend && ./mvnw spring-boot:run`
2. ユーザー登録を行う
3. 登録したメールアドレスに確認メールが届くことを確認

## トラブルシューティング

### メールが届かない

- Gmailアプリパスワードが正しいか確認
- 2段階認証が有効になっているか確認
- スパムフォルダをチェック
- ログでエラーメッセージを確認: `logging.level.org.springframework.mail=DEBUG`

### 認証エラー

- GMAIL_USERNAMEとGMAIL_APP_PASSWORDが環境変数として正しく設定されているか確認
- アプリパスワードにスペースが含まれていないか確認（スペースを削除）

## セキュリティ注意事項

- アプリパスワードは`.env`ファイルに保存し、`.gitignore`に追加
- 本番環境では環境変数として安全に管理
- アプリパスワードは定期的に再生成
```

**Step 2: .gitignoreに.envを追加**

`backend/.gitignore`に以下を追加（まだ存在しない場合）:

```
.env
```

**Step 3: コミット**

```bash
git add docs/EMAIL_SETUP.md backend/.gitignore
git commit -m "docs: メール送信設定ガイドを追加

Gmail SMTPの設定手順とトラブルシューティングを記載

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 20: 統合テストと最終確認

**Files:**
- None (テスト実行)

**Step 1: 完全なE2Eフローをテスト**

**前提条件:** Gmail SMTPが正しく設定されている

1. **ユーザー登録**
   - フロントエンドで新しいユーザーを登録
   - 確認メールが届くことを確認

2. **メール確認**
   - メール内のリンクをクリック
   - `/verify?token=...`に遷移
   - 「メールアドレスが確認されました」メッセージを確認

3. **ログイン**
   - 確認済みユーザーでログイン
   - 正常にログインできることを確認

4. **パスワードリセット**
   - ログアウト
   - 「パスワードを忘れた」をクリック
   - メールアドレスを入力してリセットメールを受信
   - メール内のリンクをクリック
   - 新しいパスワードを設定
   - 新しいパスワードでログイン成功

**Step 2: エラーケースをテスト**

1. 未確認ユーザーでログインを試みる → エラーメッセージ表示
2. 無効なトークンで確認を試みる → エラーメッセージ表示
3. 期限切れトークンでリセットを試みる → エラーメッセージ表示

**Step 3: テスト結果を記録**

テストが成功したら、以下を記録:
- 各フローが正常に動作することを確認
- エラーハンドリングが適切に機能することを確認

**Step 4: コミット不要**

このステップはテストのみなのでコミットは不要です。

---

## 完了後の次のステップ

実装が完了したら、以下を検討してください:

### 本番環境へのデプロイ前

1. **HTTPS必須:** 本番環境ではHTTPSを使用（トークンの漏洩防止）
2. **環境変数の設定:** GMAIL_USERNAME、GMAIL_APP_PASSWORD、FRONTEND_URLを安全に設定
3. **レート制限:** メール送信とログイン試行にレート制限を実装（推奨）
4. **ログ監視:** メール送信失敗やエラーを監視

### 将来的な改善

1. **HTMLメール:** ThymeleafやFreeMarkerでデザインされたHTMLメールを送信
2. **メール送信キュー:** 非同期処理でメール送信を行う（大量送信時）
3. **OAuth 2.0ログイン:** Google/Appleアカウントでのログイン
4. **2段階認証 (2FA):** ログイン時のセキュリティをさらに強化

### メンテナンス

- トークンの有効期限設定を必要に応じて調整
- メール文面を適宜更新
- Gmailアプリパスワードを定期的に再生成

---

## まとめ

この実装計画により、ひらがなアプリに以下の機能が追加されます:

✅ メールアドレスのバリデーション
✅ メール確認機能（24時間有効）
✅ パスワードリセット機能（1時間有効）
✅ セキュリティの向上（トークンベース認証）
✅ ユーザーフレンドリーなエラーハンドリング

すべてのタスクが完了したら、設計ドキュメント（`docs/plans/2026-03-05-email-verification-design.md`）の各ステージのステータスを「完了」に更新してください。
