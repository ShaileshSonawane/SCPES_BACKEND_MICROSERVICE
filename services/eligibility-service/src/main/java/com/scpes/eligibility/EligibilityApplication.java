package com.scpes.eligibility;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.scpes.eligibility", "com.scpes.common"})
public class EligibilityApplication {
    public static void main(String[] args) {
        SpringApplication.run(EligibilityApplication.class, args);
    }
}
