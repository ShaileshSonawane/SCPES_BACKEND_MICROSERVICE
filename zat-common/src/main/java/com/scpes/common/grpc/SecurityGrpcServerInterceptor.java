package com.scpes.common.grpc;

import com.scpes.common.security.JwtService;
import io.grpc.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;

import java.util.UUID;

public class SecurityGrpcServerInterceptor implements ServerInterceptor {
    private final JwtService jwt;

    public SecurityGrpcServerInterceptor(JwtService jwt) {
        this.jwt = jwt;
    }

    @Override
    public <Q, R> ServerCall.Listener<Q> interceptCall(
            ServerCall<Q, R> call,
            Metadata h,
            ServerCallHandler<Q, R> next) {
        String v = h.get(SecurityGrpcClientInterceptor.AUTH);
        if (v == null || !v.startsWith("Bearer ")) {
            call.close(Status.UNAUTHENTICATED.withDescription("Missing or invalid authorization header"), new Metadata());
            return new ServerCall.Listener<>() {};
        }
        try {
            Claims c = jwt.parse(v.substring(7));
            Context ctx = Context.current().withValue(GrpcContext.USER_ID, UUID.fromString(c.getSubject()));
            return Contexts.interceptCall(ctx, call, h, next);
        } catch (JwtException e) {
            call.close(Status.UNAUTHENTICATED.withDescription("Bad token: " + e.getMessage()), new Metadata());
            return new ServerCall.Listener<>() {};
        }
    }
}
