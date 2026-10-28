FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app
COPY services/student-service/target/student-service-1.0.0.jar app.jar
EXPOSE 8083 9093
ENV JAVA_OPTS="-XX:+UseSerialGC -Xms128m -Xmx256m -XX:+ExitOnOutOfMemoryError"
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
