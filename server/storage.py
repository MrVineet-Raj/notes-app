from typing import List

from .models import Note

# In-memory notes store mirroring `next-app/storage/notes.ts`
NOTES: List[Note] = []


