FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY proto proto
COPY zat-common/pom.xml zat-common/
COPY zat-common/src zat-common/src
COPY services/eligibility-service/pom.xml services/eligibility-service/
COPY services/eligibility-service/src services/eligibility-service/src
RUN mvn -q -pl services/eligibility-service -am -DskipTests package

FROM eclipse-temurin:21-jre
RUN addgroup --system app && adduser --system --ingroup app app
USER app
WORKDIR /app
COPY --from=build /workspace/services/eligibility-service/target/*.jar app.jar
EXPOSE 8085 9095
ENTRYPOINT ["java", "-XX:+UseZGC", "-XX:+ZGenerational", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
