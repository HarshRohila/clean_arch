import { of } from "@/libs/rx";
import { ITodoService, Models } from "@/views/web/ports";

class TodoService implements ITodoService {
  getTodos() {
    const someTodos: Models.Todo[] = [
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
