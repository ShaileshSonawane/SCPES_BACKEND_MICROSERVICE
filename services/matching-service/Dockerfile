FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY proto proto
COPY scpes-common/pom.xml scpes-common/
COPY scpes-common/src scpes-common/src
COPY services/matching-service/pom.xml services/matching-service/
COPY services/matching-service/src services/matching-service/src
RUN mvn -q -pl services/matching-service -am -DskipTests package

FROM eclipse-temurin:21-jre
RUN addgroup --system app && adduser --system --ingroup app app
USER app
WORKDIR /app
COPY --from=build /workspace/services/matching-service/target/*.jar app.jar
EXPOSE 8087 9097
ENTRYPOINT ["java", "-XX:+UseZGC", "-XX:+ZGenerational", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
