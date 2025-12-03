"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";

interface Note {
  id: string;
  text: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [modelName, setModelName] = useState("openai");
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleCreateNote = async () => {
    if (!noteText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: noteText }),
      });
      const newNote = await res.json();
      setNotes([...notes, newNote]);
      setNoteText("");
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!selectedNote || !userQuery.trim()) return;

    setSummarizing(true);
    try {
      const res = await fetch("/api/notes/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userQuery,
          notesId: selectedNote.id,
          modelName,
        }),
      });
      const data = await res.json();
      setSummary(data.summary);
      // Re-fetch notes so the new summary note appears in the list,
      // while keeping the dialog open to show the current summary.
      await fetchNotes();
    } catch (error) {
      console.error("Error summarizing:", error);
    } finally {
      setSummarizing(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      await fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const sortedNotes = [...notes].sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            AI Note Assistant
          </h1>
          <p className="text-slate-600">
            Create notes and get AI-powered summaries
          </p>
        </div>

        {/* Create Note Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create a New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-32"
            />
            <Button
              onClick={handleCreateNote}
              disabled={loading || !noteText.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Note"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notes List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Your Notes ({notes.length})
          </h2>
          {notes.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-slate-500">
                No notes yet. Create one to get started!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sortedNotes.map((note) => (
                <Card
                  key={note.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="text-slate-700 mb-4 prose prose-sm max-w-none">
                      <ReactMarkdown>{note.text}</ReactMarkdown>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedNote(note);
                              setSummary("");
                              setUserQuery("");
                            }}
                          >
                            Summarize
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Summarize Note</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Ask a question:
                              </label>
                              <Input
                                placeholder="e.g., What are the main points?"
                                value={userQuery}
                                onChange={(e) => setUserQuery(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                AI Model:
                              </label>
                              <Select
                                value={modelName}
                                onValueChange={setModelName}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="openai">
                                    OpenAI (GPT-4o Mini)
                                  </SelectItem>
                                  <SelectItem value="gemini">
                                    Google Gemini
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              onClick={handleSummarize}
                              disabled={summarizing || !userQuery.trim()}
                              className="w-full"
                            >
                              {summarizing ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Summarizing...
                                </>
                              ) : (
                                "Generate Summary"
                              )}
                            </Button>
                            {summary && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 prose prose-sm max-w-none">
                                <p className="text-sm font-medium text-blue-900 mb-2">
                                  Summary:
                                </p>
                                <ReactMarkdown className="text-slate-700">
                                  {summary}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="ml-auto text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
