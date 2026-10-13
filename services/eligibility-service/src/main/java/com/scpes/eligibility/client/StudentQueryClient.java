package com.scpes.eligibility.client;

import com.scpes.eligibility.model.StudentSnapshot;
import com.scpes.proto.student.StudentQueryGrpc;
import com.scpes.proto.student.StudentSnapshotMsg;
import com.scpes.proto.student.VerifiedStudentsRequest;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@Slf4j
public class StudentQueryClient {
    private final String host;
    private final int port;

    public StudentQueryClient(
            @Value("${student.grpc.host:localhost}") String host,
            @Value("${student.grpc.port:9093}") int port) {
        this.host = host;
        this.port = port;
    }

    public List<StudentSnapshot> fetchVerified(Integer passoutYear, Set<String> allowedBranches) {
        ManagedChannel channel = null;
        List<StudentSnapshot> snapshots = new ArrayList<>();
        try {
            channel = ManagedChannelBuilder.forAddress(host, port)
                    .usePlaintext()
                    .build();

            StudentQueryGrpc.StudentQueryBlockingStub stub = StudentQueryGrpc.newBlockingStub(channel);
            var reqBuilder = VerifiedStudentsRequest.newBuilder();
            if (passoutYear != null) reqBuilder.setPassoutYear(passoutYear);
            if (allowedBranches != null) reqBuilder.addAllBranches(allowedBranches);

            Iterator<StudentSnapshotMsg> it = stub.getVerifiedStudents(reqBuilder.build());
            while (it.hasNext()) {
                StudentSnapshotMsg msg = it.next();
                snapshots.add(new StudentSnapshot(
                        UUID.fromString(msg.getStudentId()),
                        msg.getBranch(),
                        msg.getPassoutYear(),
                        msg.getTenthPct(),
                        msg.getTwelfthPct(),
                        msg.getCgpa(),
                        msg.getActiveBacklogs(),
                        msg.getBacklogHistory(),
                        msg.getGapYears(),
                        new HashSet<>(msg.getSkillsList()),
                        msg.getAlreadyPlaced(),
                        msg.getBestPackageLpa()
                ));
            }
            log.info("Fetched {} verified student snapshots via gRPC from {}:{}", snapshots.size(), host, port);
        } catch (Exception e) {
            log.warn("Could not fetch students via gRPC from {}:{}: {}", host, port, e.getMessage());
        } finally {
            if (channel != null) {
                channel.shutdown();
            }
        }
        return snapshots;
    }
}
