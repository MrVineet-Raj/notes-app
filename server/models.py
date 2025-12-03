from typing import Literal

from pydantic import BaseModel


class Note(BaseModel):
    id: str
    text: str


class CreateNoteRequest(BaseModel):
    text: str


class CreateNoteResponse(Note):
    pass


class SummaryRequest(BaseModel):
    userQuery: str
    notesId: str
    modelName: Literal["openai", "gemini"]


class SummaryResponse(BaseModel):
    summary: str


