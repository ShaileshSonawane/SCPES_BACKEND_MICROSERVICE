package com.scpes.eligibility.dto;

import java.util.List;
import java.util.UUID;

public record RuleVersionResponse(
        UUID driveId,
        int version
) {}
