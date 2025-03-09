import { createState } from "@rx-state-utils/js";
import { TodosState, ITodosPresenter, TodosViewModel } from "./ITodosPresenter";
import { take } from "@/libs/rx";
import { Models } from "../../ports";
import { container } from "@/utils/dep-injection";

class TodosPresenter implements ITodosPresenter {
  private _todosState = createState<TodosState>({
    todos: [],
    currentEditTodoId: undefined,
    currentEditingTodo: undefined,
  });

  viewModel: TodosViewModel;

  constructor() {
    this.viewModel = {
      state: this._todosState.readOnly(),
      labels: {
        edit: "Edit",
        save: "Save",
      },
    };
  }

  handleEdit(updatedTodo: Models.Todo) {
    this._todosState.update({
      currentEditTodoId: updatedTodo.id,
      currentEditingTodo: { ...updatedTodo },
    });
  }

  isTodoInEditMode(todoId: string) {
    return this._todosState.get().currentEditTodoId === todoId;
  }

  handleSubmit() {
    this._todosState.update((currState) => ({
      todos: currState.todos.map((o) => {
        if (o.id === currState.currentEditingTodo!.id) {
          return currState.currentEditingTodo!;
        }
        return o;
      }),
      currentEditTodoId: undefined,
      currentEditingTodo: undefined,
    }));
  }
  handleExitEdit() {
    this._todosState.update({ currentEditTodoId: undefined });
  }
  handleTodoTextChange(newDesc: string) {
    this._todosState.update((currState) => ({
      currentEditingTodo: { ...currState.currentEditingTodo!, text: newDesc },
    }));
  }

  loadTodos() {
    container
      .resolve("ITodoService")
      .getTodos()
      .pipe(take(1))
      .subscribe((todos) => {
        this._todosState.update({ todos: todos });
      });
  }
}

export { TodosPresenter };
