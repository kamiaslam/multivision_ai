#!/bin/bash

echo "🚀 Starting Sim AI on port 3001..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if simstudio is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx is not available. Please install Node.js first."
    exit 1
fi

echo "📦 Starting Sim AI with npx simstudio..."
echo "🌐 Sim AI will be available at: http://localhost:3001"
echo "🔗 VoiceCake will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop Sim AI"
echo ""

# Start Sim AI on port 3001
npx simstudio --port 3001

