# Use official PostgreSQL 13 image as base
FROM postgres:13

# Set environment variables
ENV POSTGRES_DB=simdb
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copy initialization scripts into the Docker image
# Any .sql or .sh file in /docker-entrypoint-initdb.d is executed at container startup
COPY init.sql /docker-entrypoint-initdb.d/
