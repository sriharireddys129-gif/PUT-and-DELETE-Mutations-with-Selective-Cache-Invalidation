// ─────────────────────────────────────────────────────────────
// Threadbase API — already implemented. You do NOT need to edit this.
//   GET    /api/threads       → the list, newest first
//   POST   /api/threads       → creates a thread from { title, body }, returns 201
//   PUT    /api/threads/:id    → replaces title/body of a thread, returns 200 + updated
//                                (empty title returns 400)
//   DELETE /api/threads/:id    → removes a thread, returns 204 No Content (empty body)
// Small delays are added to PUT and DELETE so the isPending state is visible.
// ─────────────────────────────────────────────────────────────
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let nextId = 4;
let threads = [
  { id: 1, title: "Welcome to Threadbase", body: "Edit or delete a thread and watch the right caches refresh.", createdAt: 1 },
  { id: 2, title: "React Query keys are the bridge", body: "The list is ['threads']; each detail is ['thread', id].", createdAt: 2 },
  { id: 3, title: "Selective invalidation wins", body: "Refresh only the queries a write actually changes.", createdAt: 3 },
];

app.get("/api/threads", (req, res) => {
  const newestFirst = [...threads].sort((a, b) => b.createdAt - a.createdAt);
  res.json(newestFirst);
});

app.post("/api/threads", (req, res) => {
  const { title, body = "" } = req.body || {};
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required." });
  }
  const thread = { id: nextId++, title: title.trim(), body: String(body).trim(), createdAt: Date.now() };
  threads.push(thread);
  setTimeout(() => res.status(201).json(thread), 500);
});

// EDIT — replace title/body, return the updated resource
app.put("/api/threads/:id", (req, res) => {
  const id = Number(req.params.id);
  const thread = threads.find((t) => t.id === id);
  if (!thread) return res.status(404).json({ error: "Thread not found." });

  const { title, body } = req.body || {};
  if (title !== undefined && !String(title).trim()) {
    return res.status(400).json({ error: "Title cannot be empty." });
  }
  if (title !== undefined) thread.title = String(title).trim();
  if (body !== undefined) thread.body = String(body).trim();

  // 500ms delay so the "Saving..." (isPending) state is observable
  setTimeout(() => res.status(200).json(thread), 500);
});

// DELETE — remove and return 204 No Content (empty body)
app.delete("/api/threads/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = threads.length;
  threads = threads.filter((t) => t.id !== id);
  if (threads.length === before) return res.status(404).json({ error: "Thread not found." });

  // 500ms delay so the "Deleting..." (isPending) state is observable
  setTimeout(() => res.status(204).end(), 500);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Threadbase API running on http://localhost:${PORT}`);
});
