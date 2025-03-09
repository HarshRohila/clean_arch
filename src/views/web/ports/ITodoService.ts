import { Observable } from "@/libs/rx";
import { Todo } from "./models";

interface ITodoService {
  getTodos: () => Observable<Todo[]>;
}

export type { ITodoService };
