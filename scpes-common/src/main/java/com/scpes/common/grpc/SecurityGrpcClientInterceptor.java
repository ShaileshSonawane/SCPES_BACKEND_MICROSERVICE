package com.scpes.common.grpc;

import io.grpc.*;

import java.util.function.Supplier;

public class SecurityGrpcClientInterceptor implements ClientInterceptor {
    public static final Metadata.Key<String> AUTH = Metadata.Key.of("authorization",
            Metadata.ASCII_STRING_MARSHALLER);
    private final Supplier<String> tokenSupplier; // current request's bearer token

    public SecurityGrpcClientInterceptor(Supplier<String> tokenSupplier) {
        this.tokenSupplier = tokenSupplier;
    }

    @Override
    public <Q, R> ClientCall<Q, R> interceptCall(MethodDescriptor<Q, R> m, CallOptions o, Channel next) {
        return new ForwardingClientCall.SimpleForwardingClientCall<>(next.newCall(m, o)) {
            @Override
            public void start(Listener<R> l, Metadata h) {
                String token = tokenSupplier.get();
                if (token != null && !token.isBlank()) {
                    h.put(AUTH, token.startsWith("Bearer ") ? token : "Bearer " + token);
                }
                super.start(l, h);
            }
        };
    }
}
