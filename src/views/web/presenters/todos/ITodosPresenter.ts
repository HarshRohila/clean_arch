import { ReadOnlyState } from "@rx-state-utils/js";
import { Models } from "../../ports";

interface TodosState extends Record<string, unknown> {
  todos: Models.Todo[];
  currentEditTodoId: string | undefined;
  currentEditingTodo: Models.Todo | undefined;
}

interface TodosViewModel {
  state: ReadOnlyState<TodosState>;
  labels: Record<string, string>;
}

interface ITodosPresenter {
  loadTodos: () => void;
  handleEdit(todo: Models.Todo): void;
  handleSubmit(): void;
  handleExitEdit(): void;
  handleTodoTextChange(newText: string): void;
  isTodoInEditMode(todoId: string): boolean;
  viewModel: TodosViewModel;
}

export type { TodosState, ITodosPresenter, TodosViewModel };
