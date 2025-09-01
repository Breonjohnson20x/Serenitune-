# Serenitune Deployment Guide

This guide provides instructions for deploying the Serenitune application using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Git (optional)

## Deployment Steps

### 1. Clone or Download the Repository

If you haven't already, clone the repository or download the source code:

```bash
git clone <repository-url>
cd serenitune
```

### 2. Configure Environment Variables

Create a `.env` file in the deployment directory by copying the example file:

```bash
cd deployment
cp .env.example .env
```

Edit the `.env` file and set appropriate values for your environment:

- `SECRET_KEY`: A secure random string used for session encryption
- `FLASK_ENV`: Set to `production` for deployment
- `DATABASE_URL`: Database connection string (default uses SQLite)

### 3. Build and Start the Containers

From the deployment directory, run:

```bash
docker-compose up -d
```

This command builds the Docker images and starts the containers in detached mode.

### 4. Verify the Deployment

Check if the containers are running:

```bash
docker-compose ps
```

You should see both the frontend and backend containers running.

Access the application:
- Frontend: http://localhost (or your server's IP/domain)
- Backend API: http://localhost:5000/api

### 5. Initialize the Database (First-time Setup)

If this is the first time deploying the application, you need to seed the database with initial data:

```bash
docker-compose exec backend python seed_database.py
```

### 6. Stopping the Application

To stop the application:

```bash
docker-compose down
```

## Deployment Options

### Using a VPS or Cloud Provider

1. Set up a VPS with Docker and Docker Compose installed
2. Upload the application files to the server
3. Follow the steps above to deploy

Recommended providers:
- DigitalOcean
- AWS EC2
- Google Cloud Compute Engine
- Linode

### Using a Container Platform

You can also deploy to container platforms like:
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure Container Instances

Each platform has its own deployment process, but the Docker images created with the provided Dockerfiles should work on any of them.

## Database Options

### SQLite (Default)

The application uses SQLite by default, which stores data in a file. This is suitable for small deployments but has limitations for high traffic.

### PostgreSQL (Recommended for Production)

For production use, it's recommended to use PostgreSQL:

1. Add a PostgreSQL service to your `docker-compose.yml`:

```yaml
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: serenitune
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: serenitune
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    networks:
      - serenitune-network

volumes:
  postgres_data:
```

2. Update the `DATABASE_URL` in your `.env` file:

```
DATABASE_URL=postgresql://serenitune:your_password@postgres:5432/serenitune
```

3. Update the backend dependencies to include `psycopg2-binary`

## SSL/TLS Configuration

For production deployments, it's recommended to use HTTPS. You can:

1. Use a reverse proxy like Nginx with Let's Encrypt
2. Use a cloud provider's load balancer with SSL termination
3. Update the provided Nginx configuration to include SSL certificates

## Monitoring and Maintenance

- Set up regular database backups
- Monitor container logs: `docker-compose logs -f`
- Set up health checks and monitoring tools

## Troubleshooting

### Common Issues

1. **Database connection errors**:
   - Check if the database container is running
   - Verify the connection string in `.env`

2. **API connection errors from frontend**:
   - Check if the backend container is running
   - Verify the API URL in the frontend configuration

3. **Permission issues with volumes**:
   - Check the ownership and permissions of mounted volumes

For more help, check the container logs:

```bash
docker-compose logs backend
docker-compose logs frontend
```

## Scaling

For higher traffic applications:

1. Use a production-ready database like PostgreSQL
2. Set up multiple backend instances behind a load balancer
3. Use a CDN for static assets
4. Consider using container orchestration like Kubernetes for more complex deployments

