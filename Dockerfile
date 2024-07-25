# Use the official OpenJDK image as the base image
FROM openjdk:17-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the application's JAR file into the container
COPY target/FlowersProject-0.0.1-SNAPSHOT.jar app.jar

# Expose the port that the application will run on
EXPOSE 8083

# Set the entry point to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
