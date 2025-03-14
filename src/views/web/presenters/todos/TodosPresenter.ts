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
    addingTodo: false,
    deletingTodoId: undefined,
    savingTodoId: undefined,
  });
  private _newTodoText = createState<{ text: string }>({ text: "" });
  private _todoService = container.resolve("ITodoService");

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
        loading: "Loading...",
      },
    };
  }
  getSaveButtonLabel(): string {
    return this._todosState.get().savingTodoId
      ? "Saving..."
      : this.viewModel.labels.save;
  }
  getDeleteButtonLabel(todoId: string) {
    return this._todosState.get().deletingTodoId === todoId
      ? "Deleting..."
      : "Delete";
  }
  handleNewTodoTextChange(newText: string): void {
    this._newTodoText.update({ text: newText });
  }
  handleAddTodo(): void {
    this._todosState.update({ addingTodo: true });

    this._todoService
      .addTodo({
        text: this._newTodoText.get().text,
      })
      .pipe(
        switchMap(() => this._todoService.getTodos()),
        take(1)
      )
      .subscribe((newTodos) => {
        this._newTodoText.update({ text: "" });
        this._todosState.update({ todos: newTodos, addingTodo: false });
      });
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
    this._todosState.update({
      savingTodoId: this._todosState.get().currentEditTodoId,
    });
    const state = this._todosState.get();

    this._todoService
      .updateTodo(state.currentEditTodoId!, state.currentEditingTodo!)
      .pipe(
        switchMap(() => this._todoService.getTodos()),
        take(1)
      )
      .subscribe((newTodos) => {
        this._todosState.update(() => ({
          todos: newTodos,
          currentEditTodoId: undefined,
          currentEditingTodo: undefined,
          savingTodoId: undefined,
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
  getAddButtonLabel() {
    return this._todosState.get().addingTodo ? "Adding..." : "Add Todo";
  }
  handleDelete(todoId: string) {
    this._todosState.update({ deletingTodoId: todoId });
    this._todoService
      .deleteTodo(todoId)
      .pipe(
        switchMap(() => this._todoService.getTodos()),
        take(1)
      )
      .subscribe((newTodos) => {
        this._todosState.update({ todos: newTodos, deletingTodo: false });
      });
  }

  loadTodos() {
    this._todoService
      .getTodos()
      .pipe(take(1))
      .subscribe((todos) => {
        this._todosState.update({ todos: todos });
      });
  }
}

export { TodosPresenter };
