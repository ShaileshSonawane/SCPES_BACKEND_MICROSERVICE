package com.scpes.student.grpc;

import com.scpes.proto.student.*;
import com.scpes.student.entity.AcademicRecord;
import com.scpes.student.entity.Student;
import com.scpes.student.entity.VerificationStatus;
import com.scpes.student.repository.StudentRepository;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentQueryGrpcService extends StudentQueryGrpc.StudentQueryImplBase {
    private final StudentRepository studentRepository;

    @Override
    @Transactional(readOnly = true)
    public void getVerifiedStudents(VerifiedStudentsRequest req, StreamObserver<StudentSnapshotMsg> out) {
        try {
            int passoutYear = req.getPassoutYear();
            List<String> branches = req.getBranchesList();

            List<Student> students = studentRepository.findAll();
            for (Student s : students) {
                AcademicRecord a = s.getAcademicRecord();
                if (a == null || a.getVerificationStatus() != VerificationStatus.VERIFIED) {
                    continue; // ONLY verified students participate in eligibility
                }
                if (passoutYear > 0 && s.getPassoutYear() != passoutYear) {
                    continue;
                }
                if (!branches.isEmpty() && !branches.contains(s.getBranch())) {
                    continue;
                }
                out.onNext(toProto(s, a));
            }
            out.onCompleted();
        } catch (Exception e) {
            log.error("Error in getVerifiedStudents gRPC: {}", e.getMessage());
            out.onError(Status.INTERNAL.withDescription(e.getMessage()).asRuntimeException());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public void getStudentSnapshot(StudentIdRequest req, StreamObserver<StudentSnapshotMsg> out) {
        try {
            UUID id = UUID.fromString(req.getStudentId());
            Optional<Student> opt = studentRepository.findById(id);
            if (opt.isEmpty()) {
                opt = studentRepository.findByUserId(id);
            }
            if (opt.isPresent()) {
                Student s = opt.get();
                out.onNext(toProto(s, s.getAcademicRecord()));
            } else {
                out.onNext(StudentSnapshotMsg.getDefaultInstance());
            }
            out.onCompleted();
        } catch (Exception e) {
            log.error("Error in getStudentSnapshot gRPC: {}", e.getMessage());
            out.onError(Status.INTERNAL.withDescription(e.getMessage()).asRuntimeException());
        }
    }

    private StudentSnapshotMsg toProto(Student s, AcademicRecord a) {
        String studentId = (s.getUserId() != null) ? s.getUserId().toString() : s.getId().toString();
        var builder = StudentSnapshotMsg.newBuilder()
                .setStudentId(studentId)
                .setBranch(s.getBranch() != null ? s.getBranch() : "")
                .setPassoutYear(s.getPassoutYear())
                .addAllSkills(s.getSkills());

        if (a != null) {
            if (a.getTenthPct() != null) builder.setTenthPct(a.getTenthPct().doubleValue());
            if (a.getTwelfthPct() != null) builder.setTwelfthPct(a.getTwelfthPct().doubleValue());
            if (a.getCgpa() != null) builder.setCgpa(a.getCgpa().doubleValue());
            builder.setActiveBacklogs(a.getActiveBacklogs());
            builder.setBacklogHistory(a.getBacklogHistory());
            builder.setGapYears(a.getGapYears());
        }

        return builder.build();
    }
}
