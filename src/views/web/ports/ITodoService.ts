import { Observable } from "@/libs/rx";
import { Todo } from "./models";

interface ITodoService {
  getTodos: () => Observable<Todo[]>;
  updateTodo(todoId: string, todo: Partial<Todo>): Observable<void>;
  deleteTodo(todoId: string): Observable<void>;
  addTodo(todo: Omit<Todo, "id">): Observable<Todo>;
}

export type { ITodoService };
