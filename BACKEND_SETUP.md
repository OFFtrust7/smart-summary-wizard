
# Backend Setup for YouTube Summarization

This document explains how to set up the FastAPI backend for YouTube summarization functionality.

## Prerequisites

1. Python 3.7+ installed
2. pip (Python package manager)
3. An OpenAI API key
4. yt-dlp installed (for YouTube video downloading)

## Setup Instructions

1. Save the following code to a file named `main.py`:

```python
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import subprocess
import os
import openai
import uuid
import tempfile

app = FastAPI()

# Replace this with your actual OpenAI API key
openai.api_key = "YOUR_OPENAI_API_KEY"

class YouTubeURL(BaseModel):
    url: str

@app.post("/generate-script")
async def generate_script(data: YouTubeURL):
    try:
        # Create a temporary file for the audio
        tmp_dir = tempfile.gettempdir()
        audio_file = os.path.join(tmp_dir, f"{uuid.uuid4()}.mp3")

        # Download audio from YouTube
        command = [
            "yt-dlp",
            "-x",
            "--audio-format", "mp3",
            "-o", audio_file,
            data.url
        ]
        subprocess.run(command, check=True)

        # Read audio file for transcription
        with open(audio_file, "rb") as f:
            transcript = openai.Audio.transcribe("whisper-1", f)

        # Generate a script using GPT-4
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional video script writer."},
                {"role": "user", "content": f"Create a clean, structured script from this video transcript: {transcript['text']}"}
            ]
        )

        return {"script": response.choices[0].message.content.strip()}

    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail="Failed to download video audio.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

2. Install the required packages:

```bash
pip install fastapi uvicorn openai yt-dlp python-multipart
```

3. Set your OpenAI API key in the `main.py` file.

4. Run the server:

```bash
uvicorn main:app --reload
```

5. Configure the frontend to connect to your backend by setting the `VITE_BACKEND_API_URL` environment variable to point to your FastAPI server (default: http://localhost:8000).

## CORS Configuration

If you experience CORS issues, add the following to your FastAPI app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Production Deployment

For production:

1. Use a proper WSGI server like gunicorn
2. Secure your API endpoints
3. Update the OpenAI API key handling to use environment variables
4. Configure proper CORS settings
