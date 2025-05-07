
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import openai
import subprocess
import uuid
import tempfile

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set the OpenAI API key provided by the user
openai.api_key = "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"
# Alternatively, you can use an environment variable:
# openai.api_key = os.getenv("OPENAI_API_KEY")

# Models
class ChatRequest(BaseModel):
    prompt: str

class YouTubeURL(BaseModel):
    url: str

# Routes
@app.post("/api/chat")
async def chat(data: ChatRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": data.prompt}
            ],
            temperature=0.7
        )
        return {"text": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
        
        subprocess.run(command, check=True, timeout=300)  # 5 minute timeout

        # Read audio file for transcription
        with open(audio_file, "rb") as f:
            transcript = openai.Audio.transcribe("whisper-1", f)

        # Generate a script using GPT-4o-mini
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional video script writer."},
                {"role": "user", "content": f"Create a clean, structured script from this video transcript: {transcript['text']}"}
            ]
        )

        return {"script": response.choices[0].message.content.strip()}

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Video processing timed out")
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail="Failed to download video audio")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "Backend server is running"}

if __name__ == "__main__":
    import uvicorn
    # Run the server on port 3001 to match frontend expectations
    uvicorn.run("backend_server:app", host="0.0.0.0", port=3001, reload=True)
