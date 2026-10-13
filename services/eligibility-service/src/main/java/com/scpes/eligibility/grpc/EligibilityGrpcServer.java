package com.scpes.eligibility.grpc;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class EligibilityGrpcServer {
    @Value("${grpc.server.port:9095}")
    private int port;

    private final EligibilityQueryGrpcService eligibilityQueryService;
    private Server server;

    @PostConstruct
    public void start() throws IOException {
        server = ServerBuilder.forPort(port)
                .addService(eligibilityQueryService)
                .build()
                .start();
        log.info("Eligibility gRPC Server successfully started on port {}", port);
    }

    @PreDestroy
    public void stop() {
        if (server != null) {
            log.info("Shutting down Eligibility gRPC Server");
            server.shutdown();
        }
    }
}
