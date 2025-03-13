import { from, map, Observable } from "@/libs/rx";
import { ITodoService, Models } from "@/views/web/ports";
import { startServer } from "../utils/server";

class TodoService implements ITodoService {
  constructor() {
    startServer();
  }
  getTodos() {
    const todosPromise = fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => data.todos);

    return from(todosPromise);
  }
  updateTodo(todoId: string, todo: Partial<Models.Todo>): Observable<void> {
    const updatePromise = fetch(`/api/todos/${todoId}`, {
      method: "PATCH",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return from(updatePromise).pipe(map(() => undefined));
  }
  deleteTodo(todoId: string): Observable<void> {
    const deletePromise = fetch(`/api/todos/${todoId}`, { method: "DELETE" });
    return from(deletePromise).pipe(map(() => undefined));
  }
  addTodo(todo: Omit<Models.Todo, "id">): Observable<Models.Todo> {
    const addPromise = fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    return from(addPromise);
  }
}

export { TodoService };
