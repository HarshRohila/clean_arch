import { ITodosPresenter, TodosPresenter } from "@/views/web/todos";
import { TodoService } from "@/persistence/api/todos";
import { ITodoService } from "@/views/web/ports";

const dependencyInjectionMap = {
  ITodoService: () => new TodoService() as ITodoService,
  ITodosPresenter: () => new TodosPresenter() as ITodosPresenter,
};

type DependencyIds = keyof typeof dependencyInjectionMap;

export { dependencyInjectionMap };
export type { DependencyIds };
