// app.js
//
// Browser-side UI logic. Calls the Express /api/* routes via fetch.
// No framework — just manual DOM updates after each mutation.

const listEl = document.getElementById("todo-list");
const emptyEl = document.getElementById("empty-state");
const formEl = document.getElementById("add-form");
const titleEl = document.getElementById("title");

async function loadTodos() {
  const res = await fetch("/api/todos");
  const todos = await res.json();
  render(todos);
}

function render(todos) {
  listEl.innerHTML = "";
  emptyEl.classList.toggle("hidden", todos.length > 0);

  for (const t of todos) {
    const li = document.createElement("li");
    li.className =
      "flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = t.completed;
    checkbox.className = "h-5 w-5 cursor-pointer accent-indigo-600";
    checkbox.addEventListener("change", () => toggleTodo(t.id));

    const title = document.createElement("span");
    title.textContent = t.title;
    title.className = "flex-1" + (t.completed ? " line-through text-slate-400" : "");

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className =
      "text-sm font-medium text-rose-600 hover:text-rose-700";
    del.addEventListener("click", () => deleteTodo(t.id));

    li.append(checkbox, title, del);
    listEl.appendChild(li);
  }
}

async function addTodo(title) {
  await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  await loadTodos();
}

async function toggleTodo(id) {
  await fetch(`/api/todos/${id}/toggle`, { method: "POST" });
  await loadTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: "DELETE" });
  await loadTodos();
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleEl.value.trim();
  if (!title) return;
  titleEl.value = "";
  addTodo(title);
});

loadTodos();
