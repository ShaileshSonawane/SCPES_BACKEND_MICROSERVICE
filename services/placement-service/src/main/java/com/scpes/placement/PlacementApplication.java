package com.scpes.placement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@ComponentScan(basePackages = {"com.scpes.placement", "com.scpes.common"})
public class PlacementApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlacementApplication.class, args);
    }
}
