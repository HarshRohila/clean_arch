import { SingletonContainer } from "singleton-injection";
import { ITodosPresenter, TodosPresenter } from "@/views/web/todos";
import { TodoService } from "@/persistence/api/todos";
import { ITodoService } from "@/views/web/ports";

const dependencyInjectionMap = {
  ITodoService: () => new TodoService() as ITodoService,
  ITodosPresenter: () => new TodosPresenter() as ITodosPresenter,
};

type DependencyIds = keyof typeof dependencyInjectionMap;

function newInstance(key: DependencyIds) {
  return dependencyInjectionMap[key]();
}

export const container = new SingletonContainer(dependencyInjectionMap);
export { newInstance, dependencyInjectionMap };
export type { DependencyIds };
