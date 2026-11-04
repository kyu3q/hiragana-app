package com.hiragana.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * メール設定の診断情報を出力するクラス
 */
@Component
public class MailConfigDiagnostics {

    @Value("${spring.mail.username:NOT_SET}")
    private String mailUsername;

    @Value("${spring.mail.password:NOT_SET}")
    private String mailPassword;

    @Value("${spring.mail.host:NOT_SET}")
    private String mailHost;

    @Value("${spring.mail.port:NOT_SET}")
    private String mailPort;

    @Value("${app.frontend.url:NOT_SET}")
    private String frontendUrl;

    @EventListener(ApplicationReadyEvent.class)
    public void logMailConfiguration() {
        System.out.println("=".repeat(80));
        System.out.println("📧 メール設定の診断情報");
        System.out.println("=".repeat(80));
        System.out.println("spring.mail.host:     " + mailHost);
        System.out.println("spring.mail.port:     " + mailPort);
        System.out.println("spring.mail.username: " + (mailUsername.isEmpty() ? "❌ 空" : "✓ " + mailUsername));
        System.out.println("spring.mail.password: " + (mailPassword.isEmpty() ? "❌ 空" : "✓ 設定されています（" + mailPassword.length() + "文字）"));
        System.out.println("app.frontend.url:     " + frontendUrl);
        System.out.println("=".repeat(80));

        if (mailUsername.isEmpty() || mailPassword.isEmpty()) {
            System.err.println("⚠️  警告: メール認証情報が設定されていません！");
            System.err.println("   .envファイルを確認してください:");
            System.err.println("   - GMAIL_USERNAME が設定されているか");
            System.err.println("   - GMAIL_APP_PASSWORD が設定されているか");
            System.err.println("   - ./run-dev.sh で起動しているか");
        }
    }
}
