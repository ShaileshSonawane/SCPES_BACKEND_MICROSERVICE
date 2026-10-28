FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache fontconfig freetype ttf-dejavu \
    && addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app
COPY services/report-service/target/report-service-1.0.0.jar app.jar
EXPOSE 8086
ENV JAVA_OPTS="-XX:+UseSerialGC -Xms128m -Xmx256m -XX:+ExitOnOutOfMemoryError"
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
