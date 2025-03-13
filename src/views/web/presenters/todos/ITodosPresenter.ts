import { ReadOnlyState } from "@rx-state-utils/js";
import { Models } from "../../ports";

interface TodosState extends Record<string, unknown> {
  todos: Models.Todo[];
  currentEditTodoId: string | undefined;
  currentEditingTodo: Models.Todo | undefined;
  addingTodo: boolean;
  deletingTodoId: string | undefined;
  savingTodoId: string | undefined;
}

interface TodosViewModel {
  state: ReadOnlyState<TodosState>;
  newTodoText: ReadOnlyState<{ text: string }>;
  labels: Record<string, string>;
}

interface ITodosPresenter {
  loadTodos: () => void;
  handleEdit(todo: Models.Todo): void;
  handleSubmit(): void;
  handleExitEdit(): void;
  handleTodoTextChange(newText: string): void;
  isTodoInEditMode(todoId: string): boolean;
  handleDelete(todoId: string): void;
  handleNewTodoTextChange(newText: string): void;
  handleAddTodo(): void;
  getDeleteButtonLabel(todoId: string): string;
  getAddButtonLabel(): string;
  getSaveButtonLabel(): string;
  viewModel: TodosViewModel;
}

export type { TodosState, ITodosPresenter, TodosViewModel };
