# Stage 1: Build the Spring Boot application

FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app

# Copy Maven configuration and source code

COPY pom.xml .
COPY src ./src

# Build the executable Spring Boot JAR

RUN mvn clean package -DskipTests

# Stage 2: Run the application

FROM eclipse-temurin:25-jre

WORKDIR /app

# Copy the built JAR from the build stage

COPY --from=build /app/target/*.jar app.jar

# Render provides the PORT environment variable

EXPOSE 8080

# Start Spring Boot

ENTRYPOINT ["java", "-jar", "app.jar"]
