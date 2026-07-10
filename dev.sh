#!/bin/bash

# MedVet Development Startup Script
# This script starts all services needed for development

echo "=========================================="
echo "  MedVet - Starting Development Environment"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Function to start Docker containers
start_docker() {
    echo -e "${YELLOW}Starting Docker containers...${NC}"
    cd "$SCRIPT_DIR"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
        exit 1
    fi

    docker compose up -d
    
    echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
    sleep 5
    
    # Check if PostgreSQL is ready
    for i in {1..30}; do
        if docker exec medvet-postgres pg_isready -U medvet_admin -d medvet &> /dev/null; then
            echo -e "${GREEN}PostgreSQL is ready!${NC}"
            break
        fi
        if [ $i -eq 30 ]; then
            echo -e "${RED}PostgreSQL failed to start. Check docker logs.${NC}"
            exit 1
        fi
        sleep 1
    done
}

# Function to start backend
start_backend() {
    echo -e "${YELLOW}Starting Backend Server...${NC}"
    cd "$SCRIPT_DIR/medvet-backend"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing backend dependencies...${NC}"
        npm install
    fi
    
    # Start backend in background
    npm run dev &
    BACKEND_PID=$!
    
    echo -e "${GREEN}Backend started with PID: $BACKEND_PID${NC}"
    echo -e "${GREEN}Backend URL: http://localhost:3030${NC}"
}

# Function to start frontend
start_frontend() {
    echo -e "${YELLOW}Starting Frontend Server...${NC}"
    cd "$SCRIPT_DIR/medvet-frontend"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing frontend dependencies...${NC}"
        npm install
    fi
    
    # Start frontend in background
    npm run dev &
    FRONTEND_PID=$!
    
    echo -e "${GREEN}Frontend started with PID: $FRONTEND_PID${NC}"
    echo -e "${GREEN}Frontend URL: http://localhost:3000${NC}"
}

# Function to handle cleanup
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}Frontend stopped${NC}"
    fi
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}Backend stopped${NC}"
    fi
    
    echo -e "${YELLOW}Stopping Docker containers...${NC}"
    cd "$SCRIPT_DIR"
    docker compose stop
    
    echo -e "${GREEN}All services stopped!${NC}"
    exit 0
}

# Trap SIGINT and SIGTERM signals
trap cleanup SIGINT SIGTERM

# Main execution
echo ""
echo -e "${GREEN}Services will be available at:${NC}"
echo "  - Backend API:  http://localhost:3030"
echo "  - Frontend:     http://localhost:3000"
echo "  - PostgreSQL:   localhost:5432"
echo "  - Redis:        localhost:6379"
echo "  - pgAdmin:      http://localhost:5050"
echo "  - Directus:     http://localhost:8055"
echo ""

# Start services
start_docker
start_backend
sleep 3  # Give backend time to start
start_frontend

echo ""
echo "=========================================="
echo -e "${GREEN}  All services are running!${NC}"
echo "=========================================="
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for any process to exit
wait
