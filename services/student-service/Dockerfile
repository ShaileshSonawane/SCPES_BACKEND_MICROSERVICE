FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY proto proto
COPY zat-common/pom.xml zat-common/
COPY zat-common/src zat-common/src
COPY services/student-service/pom.xml services/student-service/
COPY services/student-service/src services/student-service/src
RUN mvn -q -pl services/student-service -am -DskipTests package

FROM eclipse-temurin:21-jre
RUN addgroup --system app && adduser --system --ingroup app app
USER app
WORKDIR /app
COPY --from=build /workspace/services/student-service/target/*.jar app.jar
EXPOSE 8083 9093
ENTRYPOINT ["java", "-XX:+UseZGC", "-XX:+ZGenerational", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
