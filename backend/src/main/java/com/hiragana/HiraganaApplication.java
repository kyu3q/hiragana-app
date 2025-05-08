package com.hiragana;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.hiragana.model")
@EnableJpaRepositories("com.hiragana.repository")
public class HiraganaApplication {
    public static void main(String[] args) {
        SpringApplication.run(HiraganaApplication.class, args);
    }
} 