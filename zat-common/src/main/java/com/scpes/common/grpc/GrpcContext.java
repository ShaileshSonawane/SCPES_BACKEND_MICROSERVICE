package com.scpes.common.grpc;

import io.grpc.Context;
import java.util.UUID;

public final class GrpcContext {
    private GrpcContext() {}
    public static final Context.Key<UUID> USER_ID = Context.key("userId");
}
