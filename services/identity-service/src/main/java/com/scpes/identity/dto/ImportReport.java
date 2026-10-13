package com.scpes.identity.dto;

import java.util.List;

public record ImportReport(
        int ok,
        List<String> errors
) {}
