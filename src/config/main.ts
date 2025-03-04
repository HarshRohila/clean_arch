import { SingletonContainer } from "singleton-injection";
import { ITodoService } from "@/domain/use-cases/todos";
import { ITodosViewModel, TodoViewModel } from "@/views/web/todos";
import { TodoService } from "@/data/api/todos";

const singletonMap = {
  ITodoService: () => new TodoService() as ITodoService,
  ITodosViewModel: () => new TodoViewModel() as ITodosViewModel,
};

export const container = new SingletonContainer(singletonMap);
