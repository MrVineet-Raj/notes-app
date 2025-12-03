import os

from dotenv import load_dotenv
from openai import OpenAI
import google.generativeai as genai


# Load variables from a .env file (at project root) into the process environment
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def summarize_with_openai(note_text: str, user_query: str) -> str:
    """
    Call OpenAI chat completions API to summarize a note.
    Mirrors the behavior of the Next.js route that uses `gpt-4o-mini`.
    """
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY environment variable is not set.")

    client = OpenAI(api_key=OPENAI_API_KEY)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a friendly AI to help summarize notes",
            },
            {
                "role": "user",
                "content": f"NOTE: {note_text}\n\nUser Query: {user_query}",
            },
        ],
    )

    message = response.choices[0].message
    return message.content or "No summary generated"


def summarize_with_gemini(note_text: str, user_query: str) -> str:
    """
    Call Gemini to summarize a note.
    Mirrors the prompt used in the Next.js route with `gemini-2.5-flash`.
    """
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY environment variable is not set.")

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = (
        "You are a friendly AI to help summarize notes and i am attachinf a notes "
        "it's not referring to you in any kind .\n\n"
        f"NOTE: {note_text}\n\nUser Query: {user_query}"
    )

    result = model.generate_content(prompt)
    text = result.text
    return text or "No summary generated"


