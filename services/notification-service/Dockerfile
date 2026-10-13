FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY proto proto
COPY scpes-common/pom.xml scpes-common/
COPY scpes-common/src scpes-common/src
COPY services/notification-service/pom.xml services/notification-service/
COPY services/notification-service/src services/notification-service/src
RUN mvn -q -pl services/notification-service -am -DskipTests package

FROM eclipse-temurin:21-jre
RUN addgroup --system app && adduser --system --ingroup app app
USER app
WORKDIR /app
COPY --from=build /workspace/services/notification-service/target/*.jar app.jar
EXPOSE 8081 9091
ENTRYPOINT ["java", "-XX:+UseZGC", "-XX:+ZGenerational", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
