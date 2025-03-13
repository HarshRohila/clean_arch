import { createState } from "@rx-state-utils/js";
import { TodosState, ITodosPresenter, TodosViewModel } from "./ITodosPresenter";
import { take } from "@/libs/rx";
import { Models } from "../../ports";
import { container } from "@/utils/dep-injection";
import { switchMap } from "rxjs";

class TodosPresenter implements ITodosPresenter {
  private _todosState = createState<TodosState>({
    todos: [],
    currentEditTodoId: undefined,
    currentEditingTodo: undefined,
  });

  private _newTodoText = createState<{ text: string }>({ text: "" });

  viewModel: TodosViewModel;

  constructor() {
    this.viewModel = {
      state: this._todosState.readOnly(),
      newTodoText: this._newTodoText.readOnly(),
      labels: {
        edit: "Edit",
        save: "Save",
        delete: "Delete",
        add: "Add Todo",
        newTodoPlaceholder: "New Todo",
      },
    };
  }
  handleNewTodoTextChange(newText: string): void {
    this._newTodoText.update({ text: newText });
  }
  handleAddTodo(): void {
    this.todoService
      .addTodo({
        text: this._newTodoText.get().text,
      })
      .pipe(
        switchMap(() => this.todoService.getTodos()),
        take(1)
      )
      .subscribe((newTodos) => {
        this._newTodoText.update({ text: "" });
        this._todosState.update({ todos: newTodos });
      });
  }

  private todoService = container.resolve("ITodoService");

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
    const state = this._todosState.get();

    this.todoService
      .updateTodo(state.currentEditTodoId!, state.currentEditingTodo!)
      .pipe(
        switchMap(() => this.todoService.getTodos()),
        take(1)
      )
      .subscribe((newTodos) => {
        this._todosState.update(() => ({
          todos: newTodos,
          currentEditTodoId: undefined,
          currentEditingTodo: undefined,
        }));
      });
  }
  handleExitEdit() {
    this._todosState.update({ currentEditTodoId: undefined });
  }
  handleTodoTextChange(newDesc: string) {
    this._todosState.update((currState) => ({
      currentEditingTodo: { ...currState.currentEditingTodo!, text: newDesc },
    }));
  }

  handleDelete(todoId: string) {
    this.todoService
      .deleteTodo(todoId)
      .pipe(
        switchMap(() => this.todoService.getTodos()),
        take(1)
      )
      .subscribe((newTodos) => {
        this._todosState.update({ todos: newTodos });
      });
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
