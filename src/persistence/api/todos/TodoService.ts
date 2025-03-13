import { Observable, of } from "@/libs/rx";
import { ITodoService, Models } from "@/views/web/ports";

class TodoService implements ITodoService {
  addTodo(todo: Omit<Models.Todo, "id">): Observable<Models.Todo> {
    const newTodo = { ...todo, id: String(this.todos.length + 1) };
    this.todos.push(newTodo);
    return of(newTodo);
  }
  deleteTodo(todoId: string): Observable<void> {
    this.todos = this.todos.filter((t) => t.id !== todoId);
    return of(undefined);
  }
  updateTodo(todoId: string, todo: Partial<Models.Todo>): Observable<void> {
    this.todos = this.todos.map((t) => {
      if (t.id === todoId) {
        return { ...t, ...todo };
      }
      return t;
    });
    return of(undefined);
  }

  private todos: Models.Todo[] = [
    {
      id: "1",
      text: "homework",
    },
    {
      id: "2",
      text: "pay bills",
    },
  ];

  getTodos() {
    return of(this.todos);
  }
}

export { TodoService };
