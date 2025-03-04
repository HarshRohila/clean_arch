import { TodoModel } from "@/domain/entities";
import { ReadOnlyState } from "@rx-state-utils/js";

interface TodosState extends Record<string, unknown> {
  todos: TodoModel[];
  currentEditTodoId: string | undefined;
  currentEditingTodo: TodoModel | undefined;
}

interface ITodosViewModel {
  todosState: ReadOnlyState<TodosState>;
  loadTodos: () => void;
  handleEdit(todo: TodoModel): void;
  handleSubmit(): void;
  handleExitEdit(): void;
  handleTodoTextChange(newText: string): void;
  isTodoInEditMode(todoId: string): boolean;
}

export type { TodosState, ITodosViewModel };
