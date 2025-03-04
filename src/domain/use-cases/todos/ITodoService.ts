import { TodoModel } from "@/domain/entities";
import { Observable } from "@/libs/rx";

interface ITodoService {
  getTodos: () => Observable<TodoModel[]>;
}

export type { ITodoService };
