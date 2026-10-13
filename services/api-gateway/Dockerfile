FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY proto proto
COPY scpes-common/pom.xml scpes-common/
COPY scpes-common/src scpes-common/src
COPY services/api-gateway/pom.xml services/api-gateway/
COPY services/api-gateway/src services/api-gateway/src
RUN mvn -q -pl services/api-gateway -am -DskipTests package

FROM eclipse-temurin:21-jre
RUN addgroup --system app && adduser --system --ingroup app app
USER app
WORKDIR /app
COPY --from=build /workspace/services/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseZGC", "-XX:+ZGenerational", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
