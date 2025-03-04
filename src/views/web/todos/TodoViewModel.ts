import { createState, ReadOnlyState } from "@rx-state-utils/js";
import { TodosState, ITodosViewModel } from "./ITodosViewModel";
import { container } from "@/config/main";
import { take } from "@/libs/rx";
import { TodoModel } from "@/domain/entities";

class TodoViewModel implements ITodosViewModel {
  private _todosState = createState<TodosState>({
    todos: [],
    currentEditTodoId: undefined,
    currentEditingTodo: undefined,
  });

  todosState: ReadOnlyState<TodosState>;
  constructor() {
    this.todosState = this._todosState.readOnly();
  }

  handleEdit(updatedTodo: TodoModel) {
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

export { TodoViewModel };
