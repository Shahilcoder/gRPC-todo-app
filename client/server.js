// server.js
//
// Express HTTP server for the browser UI. Each /api route is a thin
// translator: parse the HTTP request, call the gRPC stub, return JSON.
// This is the layer where "browser ↔ Node" meets "Node ↔ Go".

const path = require("path");
const express = require("express");
const grpc = require("./grpc-client");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/todos", async (_req, res, next) => {
  try {
    const { todos = [] } = await grpc.listTodos({});
    res.json(todos);
  } catch (err) { next(err); }
});

app.post("/api/todos", async (req, res, next) => {
  try {
    const title = (req.body.title || "").trim();
    if (!title) return res.status(400).json({ error: "title required" });
    const todo = await grpc.createTodo({ title });
    res.status(201).json(todo);
  } catch (err) { next(err); }
});

app.post("/api/todos/:id/toggle", async (req, res, next) => {
  try {
    const todo = await grpc.toggleTodo({ id: Number(req.params.id) });
    res.json(todo);
  } catch (err) { next(err); }
});

app.delete("/api/todos/:id", async (req, res, next) => {
  try {
    await grpc.deleteTodo({ id: Number(req.params.id) });
    res.status(204).end();
  } catch (err) { next(err); }
});

app.use((err, _req, res, _next) => {
  console.error("gRPC/HTTP error:", err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Web UI on http://localhost:${PORT}`);
});
