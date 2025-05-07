
# SnapSummary Backend Setup Guide

This document explains how to set up the backend for SnapSummary application.

## Prerequisites

1. Python 3.7+ installed
2. pip (Python package manager)
3. An OpenAI API key
4. yt-dlp installed (for YouTube video downloading)

## Setup Instructions

### Option 1: Automated Setup (Linux/Mac)

1. Make the setup script executable:
   ```bash
   chmod +x setup_backend.sh
   ```

2. Run the setup script:
   ```bash
   ./setup_backend.sh
   ```

### Option 2: Manual Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Backend

1. Activate the virtual environment (if not already activated):
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

2. Set your OpenAI API key:
   - On Windows: `set OPENAI_API_KEY=your-api-key-here`
   - On macOS/Linux: `export OPENAI_API_KEY=your-api-key-here`

3. Run the backend:
   ```bash
   python backend_server.py
   ```

The server will start at http://localhost:3001

## Configuring the Frontend

1. Create a `.env` file in the frontend root directory based on `.env.example`.

2. Set the backend URL in `.env`:
   ```
   VITE_BACKEND_API_URL=http://localhost:3001
   ```

3. If you want to use direct OpenAI integration (not recommended for production), add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your-openai-api-key-here
   ```

## Troubleshooting

- If you encounter issues with yt-dlp, make sure it's correctly installed and updated:
  ```bash
  pip install --upgrade yt-dlp
  ```

- To test if the server is running correctly, visit http://localhost:3001 in your browser.

- If you receive CORS errors, ensure the frontend URL is correctly added to the allowed origins in the backend.
