FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY proto proto
COPY scpes-common/pom.xml scpes-common/
COPY scpes-common/src scpes-common/src
COPY services/placement-service/pom.xml services/placement-service/
COPY services/placement-service/src services/placement-service/src
RUN mvn -q -pl services/placement-service -am -DskipTests package

FROM eclipse-temurin:21-jre
RUN addgroup --system app && adduser --system --ingroup app app
USER app
WORKDIR /app
COPY --from=build /workspace/services/placement-service/target/*.jar app.jar
EXPOSE 8084 9094
ENTRYPOINT ["java", "-XX:+UseZGC", "-XX:+ZGenerational", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
