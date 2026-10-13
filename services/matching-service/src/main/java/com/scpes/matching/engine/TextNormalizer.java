package com.scpes.matching.engine;

public final class TextNormalizer {
    private TextNormalizer() {}

    public static String normalize(String raw) {
        if (raw == null) return "";
        return raw.toLowerCase()
                .replaceAll("[^a-z0-9+#\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }
}
