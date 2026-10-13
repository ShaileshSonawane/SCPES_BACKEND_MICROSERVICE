package com.scpes.matching;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.scpes.matching", "com.scpes.common"})
public class MatchingApplication {
    public static void main(String[] args) {
        SpringApplication.run(MatchingApplication.class, args);
    }
}
