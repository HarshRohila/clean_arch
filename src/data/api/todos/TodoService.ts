import { of } from "@/libs/rx";
import { TodoModel } from "@/domain/entities";
import { ITodoService } from "@/domain/use-cases/todos";

class TodoService implements ITodoService {
  getTodos() {
    const someTodos: TodoModel[] = [
      {
        id: "1",
        text: "homework",
      },
      {
        id: "2",
        text: "pay bills",
      },
    ];

    return of(someTodos);
  }
}

export { TodoService };
