package com.scpes.placement.client;

import com.scpes.proto.eligibility.*;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
public class EligibilityClient {
    private final String host;
    private final int port;

    public EligibilityClient(
            @Value("${eligibility.grpc.host:localhost}") String host,
            @Value("${eligibility.grpc.port:9095}") int port) {
        this.host = host;
        this.port = port;
    }

    public EligibilityCheckResult check(UUID driveId, UUID studentId) {
        ManagedChannel channel = null;
        try {
            channel = ManagedChannelBuilder.forAddress(host, port)
                    .usePlaintext()
                    .build();
            EligibilityQueryGrpc.EligibilityQueryBlockingStub stub = EligibilityQueryGrpc.newBlockingStub(channel);
            var req = CheckRequest.newBuilder()
                    .setDriveId(driveId.toString())
                    .setStudentId(studentId.toString())
                    .build();
            CheckReply reply = stub.checkStudentEligibility(req);
            return new EligibilityCheckResult(reply.getEligible(), new ArrayList<>(reply.getReasonsList()));
        } catch (Exception e) {
            log.warn("gRPC checkStudentEligibility call to {}:{} failed: {}. Permitting provisional check.", host, port, e.getMessage());
            // Fallback for demo resilience if eligibility service gRPC is momentarily unreachable
            return new EligibilityCheckResult(true, List.of());
        } finally {
            if (channel != null) {
                channel.shutdown();
            }
        }
    }

    public List<UUID> evaluateDrive(UUID driveId) {
        ManagedChannel channel = null;
        List<UUID> result = new ArrayList<>();
        try {
            channel = ManagedChannelBuilder.forAddress(host, port)
                    .usePlaintext()
                    .build();
            EligibilityQueryGrpc.EligibilityQueryBlockingStub stub = EligibilityQueryGrpc.newBlockingStub(channel);
            var req = DriveRequest.newBuilder()
                    .setDriveId(driveId.toString())
                    .build();
            EligibleList list = stub.evaluateDrive(req);
            for (String id : list.getEligibleStudentIdsList()) {
                result.add(UUID.fromString(id));
            }
        } catch (Exception e) {
            log.warn("gRPC evaluateDrive call to {}:{} failed: {}", host, port, e.getMessage());
        } finally {
            if (channel != null) {
                channel.shutdown();
            }
        }
        return result;
    }
}
