import { ITodosPresenter, TodosPresenter } from "@/views/web/presenters/todos";
import { ITodoService } from "@/views/web/ports";
import { TodoService } from "@/persistence/mock-server/todos";

const dependencyInjectionMap = {
  ITodoService: () => new TodoService() as ITodoService,
  ITodosPresenter: () => new TodosPresenter() as ITodosPresenter,
};

type DependencyIds = keyof typeof dependencyInjectionMap;

export { dependencyInjectionMap };
export type { DependencyIds };
