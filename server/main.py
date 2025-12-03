import asyncio
import time
from typing import List

import httpx
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse, PlainTextResponse

from .models import (
    CreateNoteRequest,
    Note,
    SummaryRequest,
    SummaryResponse,
)
from .storage import NOTES
from .llm_clients import summarize_with_openai, summarize_with_gemini


app = FastAPI(title="Notes FastAPI backend")


KEEPALIVE_URL = "https://notesapp-mrvineetraj.onrender.com/"
PING_INTERVAL_SECONDS = 300


async def _keepalive_loop():
    """
    Periodically call the Render URL to keep it warm.
    """
    async with httpx.AsyncClient(timeout=10) as client:
        while True:
            try:
                await client.get(KEEPALIVE_URL)
            except Exception:
                # Avoid crashing the loop on transient errors
                pass
            await asyncio.sleep(PING_INTERVAL_SECONDS)


@app.on_event("startup")
async def start_keepalive_task():
    asyncio.create_task(_keepalive_loop())


@app.get("/", response_class=PlainTextResponse)
async def root():
    return "server is up"


@app.get("/api/notes", response_model=List[Note])
def list_notes() -> List[Note]:
    print("Listing notes", NOTES)
    """
    Mirror Next.js GET /api/notes – return all notes.
    """
    return NOTES


@app.post("/api/notes", response_model=Note, status_code=status.HTTP_201_CREATED)
def create_note(payload: CreateNoteRequest) -> Note:
    """
    Mirror Next.js POST /api/notes – create a new note with timestamp-based id.
    """
    note = Note(id=str(int(time.time() * 1000)), text=payload.text)
    NOTES.append(note)
    return note


@app.delete("/api/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: str):
    """
    Delete a note by id.
    """
    global NOTES
    before_count = len(NOTES)
    NOTES = [n for n in NOTES if n.id != note_id]
    if len(NOTES) == before_count:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
        )
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


@app.post("/api/notes/summary", response_model=SummaryResponse)
def summarize_note(payload: SummaryRequest):
    """
    Mirror Next.js POST /api/notes/summary.
    Uses OpenAI or Gemini depending on `modelName`.
    """
    try:
        user_query = payload.userQuery
        notes_id = payload.notesId
        model_name = payload.modelName

        if not user_query or not notes_id:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"error": "userQuery and notesId are required"},
            )

        note = next((n for n in NOTES if n.id == notes_id), None)
        if not note:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"error": "Note not found"},
            )

        if model_name == "openai":
            llm_res = summarize_with_openai(note.text, user_query)
        elif model_name == "gemini":
            llm_res = summarize_with_gemini(note.text, user_query)
        else:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"error": "Invalid modelName. Use 'openai' or 'gemini'."},
            )

        summary = llm_res or "No summary generated"
        newNote = Note(id=str(int(time.time() * 1000)), text=summary)
        NOTES.append(newNote)
        return SummaryResponse(summary=summary)

    except Exception:
        # Log in real deployment; keep message similar to Next.js route.
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "Failed to summarize note"},
        )


