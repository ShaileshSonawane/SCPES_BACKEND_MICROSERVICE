package com.scpes.identity.grpc;

import com.scpes.common.security.JwtService;
import com.scpes.identity.entity.User;
import com.scpes.identity.repository.UserRepository;
import com.scpes.proto.identity.*;
import io.grpc.stub.StreamObserver;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class IdentityQueryGrpcService extends IdentityQueryGrpc.IdentityQueryImplBase {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void getUserById(UserRequest request, StreamObserver<UserResponse> responseObserver) {
        try {
            UUID userId = UUID.fromString(request.getUserId());
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User u = userOpt.get();
                UserResponse response = UserResponse.newBuilder()
                        .setUserId(u.getId().toString())
                        .setEmail(u.getEmail())
                        .setRole(u.getRole().getName())
                        .setUserCode(u.getUserCode())
                        .build();
                responseObserver.onNext(response);
            } else {
                responseObserver.onNext(UserResponse.getDefaultInstance());
            }
            responseObserver.onCompleted();
        } catch (Exception e) {
            log.error("Error in getUserById gRPC: {}", e.getMessage());
            responseObserver.onError(e);
        }
    }

    @Override
    public void validateToken(TokenRequest request, StreamObserver<TokenValidationResponse> responseObserver) {
        try {
            Claims claims = jwtService.parse(request.getToken());
            TokenValidationResponse response = TokenValidationResponse.newBuilder()
                    .setValid(true)
                    .setUserId(claims.getSubject())
                    .setEmail(claims.get("email", String.class))
                    .setRole(claims.get("role", String.class))
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            TokenValidationResponse response = TokenValidationResponse.newBuilder()
                    .setValid(false)
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }
}
