# Stage 1: Build the Spring Boot application

FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Stage 2: Run the application with Java and Tesseract

FROM eclipse-temurin:25-jre

RUN apt-get update
&& apt-get install -y --no-install-recommends
tesseract-ocr
tesseract-ocr-eng
&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY tessdata/ /app/tessdata/

# Configure the OCR data directory

ENV invoice.ocr.tessdata-path=/app/tessdata

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
