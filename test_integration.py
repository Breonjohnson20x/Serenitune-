#!/usr/bin/env python3
"""
Integration test script for Serenitune application.
Tests the connection between frontend and backend components.
"""

import os
import sys
import time
import json
import requests
import subprocess
import signal
import argparse
from urllib.parse import urljoin

# Default configuration
DEFAULT_BACKEND_URL = "http://localhost:5000"
DEFAULT_FRONTEND_URL = "http://localhost:5173"

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(message):
    print(f"\n{Colors.HEADER}{Colors.BOLD}=== {message} ==={Colors.ENDC}\n")

def print_success(message):
    print(f"{Colors.OKGREEN}✓ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.FAIL}✗ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.WARNING}! {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.OKBLUE}i {message}{Colors.ENDC}")

def start_backend(backend_dir):
    """Start the Flask backend server"""
    print_info("Starting backend server...")
    os.chdir(backend_dir)
    
    # Activate virtual environment if it exists
    if os.path.exists("venv/bin/activate"):
        activate_script = os.path.join(os.getcwd(), "venv/bin/activate")
        command = f"source {activate_script} && python src/main.py"
        process = subprocess.Popen(command, shell=True, preexec_fn=os.setsid)
    else:
        process = subprocess.Popen(["python", "src/main.py"], preexec_fn=os.setsid)
    
    # Wait for server to start
    time.sleep(2)
    return process

def start_frontend(frontend_dir):
    """Start the React frontend development server"""
    print_info("Starting frontend server...")
    os.chdir(frontend_dir)
    
    # Check if using npm, yarn, or pnpm
    if os.path.exists("package-lock.json"):
        process = subprocess.Popen(["npm", "run", "dev"], preexec_fn=os.setsid)
    elif os.path.exists("yarn.lock"):
        process = subprocess.Popen(["yarn", "dev"], preexec_fn=os.setsid)
    else:
        process = subprocess.Popen(["pnpm", "run", "dev"], preexec_fn=os.setsid)
    
    # Wait for server to start
    time.sleep(5)
    return process

def stop_process(process):
    """Stop a running process"""
    if process:
        os.killpg(os.getpgid(process.pid), signal.SIGTERM)
        process.wait()

def test_backend_health(url):
    """Test if the backend is running and responding"""
    print_header("Testing Backend Health")
    try:
        response = requests.get(urljoin(url, "/health"))
        if response.status_code == 200:
            print_success(f"Backend is running at {url}")
            return True
        else:
            print_error(f"Backend returned status code {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error(f"Could not connect to backend at {url}")
        return False

def test_backend_api(url):
    """Test backend API endpoints"""
    print_header("Testing Backend API Endpoints")
    
    endpoints = [
        {"path": "/api/tracks", "method": "GET", "name": "Get all tracks"},
        {"path": "/api/tracks/categories", "method": "GET", "name": "Get track categories"}
    ]
    
    all_passed = True
    
    for endpoint in endpoints:
        try:
            if endpoint["method"] == "GET":
                response = requests.get(urljoin(url, endpoint["path"]))
            
            if response.status_code == 200:
                print_success(f"{endpoint['name']} - {endpoint['path']}")
                try:
                    # Try to parse JSON response
                    json_data = response.json()
                    if json_data:
                        print_info(f"  Response contains valid JSON data")
                except ValueError:
                    print_warning(f"  Response is not valid JSON")
            else:
                print_error(f"{endpoint['name']} - {endpoint['path']} - Status: {response.status_code}")
                all_passed = False
        except requests.exceptions.RequestException as e:
            print_error(f"{endpoint['name']} - {endpoint['path']} - Error: {str(e)}")
            all_passed = False
    
    return all_passed

def test_cors_headers(url):
    """Test if CORS headers are properly set"""
    print_header("Testing CORS Headers")
    
    try:
        headers = {
            "Origin": "http://localhost:5173"
        }
        response = requests.options(urljoin(url, "/api/tracks"), headers=headers)
        
        cors_headers = [
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Headers"
        ]
        
        all_passed = True
        for header in cors_headers:
            if header in response.headers:
                print_success(f"CORS header '{header}' is present")
            else:
                print_error(f"CORS header '{header}' is missing")
                all_passed = False
        
        return all_passed
    except requests.exceptions.RequestException as e:
        print_error(f"CORS test failed: {str(e)}")
        return False

def test_frontend_backend_connection(backend_url, frontend_url):
    """Test if frontend can connect to backend"""
    print_header("Testing Frontend-Backend Connection")
    
    # This is a simplified test - in a real scenario, you might want to use
    # a headless browser like Selenium to test actual API calls from the frontend
    print_info("Note: This is a basic connectivity test. For complete testing, use browser automation.")
    
    try:
        # Check if frontend is accessible
        frontend_response = requests.get(frontend_url)
        if frontend_response.status_code == 200:
            print_success(f"Frontend is accessible at {frontend_url}")
        else:
            print_error(f"Frontend returned status code {frontend_response.status_code}")
            return False
        
        # Check if backend is accessible from the same origin as frontend
        backend_response = requests.get(urljoin(backend_url, "/health"), 
                                       headers={"Origin": frontend_url})
        
        if backend_response.status_code == 200:
            print_success(f"Backend is accessible from frontend origin")
            return True
        else:
            print_error(f"Backend returned status code {backend_response.status_code} when accessed from frontend origin")
            return False
    except requests.exceptions.RequestException as e:
        print_error(f"Connection test failed: {str(e)}")
        return False

def generate_deployment_config():
    """Generate deployment configuration files"""
    print_header("Generating Deployment Configuration")
    
    # Create a directory for deployment files
    deploy_dir = os.path.join(os.getcwd(), "deployment")
    os.makedirs(deploy_dir, exist_ok=True)
    
    # Generate Docker Compose file
    docker_compose = """version: '3'

services:
  backend:
    build:
      context: ./serenitune-backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=change_this_in_production
    volumes:
      - ./serenitune-backend/src/static:/app/src/static
      - ./serenitune-backend/src/database:/app/src/database
    restart: always

  frontend:
    build:
      context: ./serenitune-frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
"""
    
    # Generate backend Dockerfile
    backend_dockerfile = """FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "src/main.py"]
"""
    
    # Generate frontend Dockerfile
    frontend_dockerfile = """FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
"""
    
    # Generate nginx configuration
    nginx_conf = """server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
"""
    
    # Write files
    with open(os.path.join(deploy_dir, "docker-compose.yml"), "w") as f:
        f.write(docker_compose)
    
    backend_deploy_dir = os.path.join(deploy_dir, "backend")
    os.makedirs(backend_deploy_dir, exist_ok=True)
    with open(os.path.join(backend_deploy_dir, "Dockerfile"), "w") as f:
        f.write(backend_dockerfile)
    
    frontend_deploy_dir = os.path.join(deploy_dir, "frontend")
    os.makedirs(frontend_deploy_dir, exist_ok=True)
    with open(os.path.join(frontend_deploy_dir, "Dockerfile"), "w") as f:
        f.write(frontend_dockerfile)
    
    with open(os.path.join(frontend_deploy_dir, "nginx.conf"), "w") as f:
        f.write(nginx_conf)
    
    print_success(f"Deployment configuration generated in {deploy_dir}")
    print_info("Files created:")
    print("  - docker-compose.yml")
    print("  - backend/Dockerfile")
    print("  - frontend/Dockerfile")
    print("  - frontend/nginx.conf")

def main():
    parser = argparse.ArgumentParser(description="Serenitune Integration Test Script")
    parser.add_argument("--backend-url", default=DEFAULT_BACKEND_URL, help=f"Backend URL (default: {DEFAULT_BACKEND_URL})")
    parser.add_argument("--frontend-url", default=DEFAULT_FRONTEND_URL, help=f"Frontend URL (default: {DEFAULT_FRONTEND_URL})")
    parser.add_argument("--start-servers", action="store_true", help="Start backend and frontend servers")
    parser.add_argument("--generate-deploy", action="store_true", help="Generate deployment configuration")
    
    args = parser.parse_args()
    
    backend_process = None
    frontend_process = None
    
    try:
        if args.start_servers:
            # Get the absolute paths to the backend and frontend directories
            current_dir = os.getcwd()
            backend_dir = os.path.join(current_dir, "serenitune-backend")
            frontend_dir = os.path.join(current_dir, "serenitune-frontend")
            
            # Start the servers
            backend_process = start_backend(backend_dir)
            frontend_process = start_frontend(frontend_dir)
        
        # Run tests
        backend_health = test_backend_health(args.backend_url)
        if not backend_health:
            print_error("Backend health check failed. Skipping remaining tests.")
            return 1
        
        api_test = test_backend_api(args.backend_url)
        cors_test = test_cors_headers(args.backend_url)
        connection_test = test_frontend_backend_connection(args.backend_url, args.frontend_url)
        
        # Generate deployment configuration if requested
        if args.generate_deploy:
            generate_deployment_config()
        
        # Print summary
        print_header("Test Summary")
        print(f"Backend Health: {'✓' if backend_health else '✗'}")
        print(f"API Endpoints: {'✓' if api_test else '✗'}")
        print(f"CORS Headers: {'✓' if cors_test else '✗'}")
        print(f"Frontend-Backend Connection: {'✓' if connection_test else '✗'}")
        
        if all([backend_health, api_test, cors_test, connection_test]):
            print_success("All tests passed! The application is ready for deployment.")
            return 0
        else:
            print_warning("Some tests failed. Please fix the issues before deployment.")
            return 1
    
    except KeyboardInterrupt:
        print_info("\nTests interrupted by user.")
    finally:
        # Stop servers if they were started
        if backend_process:
            print_info("Stopping backend server...")
            stop_process(backend_process)
        
        if frontend_process:
            print_info("Stopping frontend server...")
            stop_process(frontend_process)

if __name__ == "__main__":
    sys.exit(main())

