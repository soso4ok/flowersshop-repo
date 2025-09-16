
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 mvn -q -e -DskipTests dependency:go-offline

COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080

ENV JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD bash -c 'exec 3<>/dev/tcp/127.0.0.1/8080' || exit 1


ENTRYPOINT ["bash","-lc","mkdir -p /app/src/main/resources/images && exec java -jar /app/app.jar"]


    