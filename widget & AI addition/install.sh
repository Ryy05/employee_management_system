#!/bin/bash

# Installation script for Employee Management System
# This script sets up the entire system from scratch

set -e  # Exit on any error

echo "🚀 Starting Employee Management System Installation..."

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to version 18 or higher."
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check pip
if ! command -v pip3 &> /dev/null && ! command -v pip &> /dev/null; then
    echo "❌ pip is not installed. Please install pip and try again."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd employee-mgmt-system-main/backend
npm install
cd ../..

echo "📦 Installing frontend dependencies..."
cd employee-mgmt-system-main/frontend
npm install
cd ../..

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
if command -v pip3 &> /dev/null; then
    pip3 install -r python_requirements.txt
else
    pip install -r python_requirements.txt
fi

# Setup environment
echo "⚙️  Setting up environment configuration..."
node scripts/setup-env.js

echo "🎉 Installation complete!"
echo ""
echo "🚀 Quick start commands:"
echo "   npm run dev          # Start all services in development mode"
echo "   npm run docker:up    # Start with Docker (requires Docker installed)"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "🌐 Once running, access:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"  
echo "   Chatbot:  http://localhost:5001"