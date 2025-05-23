package com.hiragana.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Hiragana Learning Application API is running!";
    }

    @GetMapping("/api/test")
    public String test() {
        return "API test endpoint is working!";
    }
} 