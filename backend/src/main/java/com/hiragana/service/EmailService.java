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
