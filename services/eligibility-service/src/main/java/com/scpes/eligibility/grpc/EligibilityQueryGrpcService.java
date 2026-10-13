package com.scpes.eligibility.grpc;

import com.scpes.eligibility.dto.EligibilityRow;
import com.scpes.eligibility.service.EligibilityService;
import com.scpes.proto.eligibility.*;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EligibilityQueryGrpcService extends EligibilityQueryGrpc.EligibilityQueryImplBase {
    private final EligibilityService eligibilityService;

    @Override
    public void evaluateDrive(DriveRequest req, StreamObserver<EligibleList> out) {
        try {
            UUID driveId = UUID.fromString(req.getDriveId());
            eligibilityService.evaluateDrive(driveId);
            List<UUID> eligibleIds = eligibilityService.getEligibleStudentIds(driveId);

            var builder = EligibleList.newBuilder();
            for (UUID id : eligibleIds) {
                builder.addEligibleStudentIds(id.toString());
            }
            out.onNext(builder.build());
            out.onCompleted();
        } catch (Exception e) {
            log.error("Error evaluating drive over gRPC: {}", e.getMessage());
            out.onError(e);
        }
    }

    @Override
    public void evaluateJob(JobRequest req, StreamObserver<EligibleList> out) {
        try {
            UUID jobId = UUID.fromString(req.getJobId());
            eligibilityService.evaluateDrive(jobId);
            List<UUID> eligibleIds = eligibilityService.getEligibleStudentIds(jobId);

            var builder = EligibleList.newBuilder();
            for (UUID id : eligibleIds) {
                builder.addEligibleStudentIds(id.toString());
            }
            out.onNext(builder.build());
            out.onCompleted();
        } catch (Exception e) {
            log.error("Error evaluating job over gRPC: {}", e.getMessage());
            out.onError(e);
        }
    }

    @Override
    public void checkStudentEligibility(CheckRequest req, StreamObserver<CheckReply> out) {
        try {
            UUID driveId = UUID.fromString(req.getDriveId());
            UUID studentId = UUID.fromString(req.getStudentId());

            EligibilityRow row = eligibilityService.forStudent(driveId, studentId);
            var reply = CheckReply.newBuilder()
                    .setEligible(row.eligible())
                    .addAllReasons(row.reasons())
                    .build();
            out.onNext(reply);
            out.onCompleted();
        } catch (Exception e) {
            log.error("Error checking student eligibility over gRPC: {}", e.getMessage());
            out.onError(e);
        }
    }
}
