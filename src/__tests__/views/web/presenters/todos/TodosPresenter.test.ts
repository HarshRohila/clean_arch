import { of } from "@/libs/rx";
import { container } from "@/utils/dep-injection";
import { TodosPresenter } from "@/views/web/presenters/todos";
import { describe, test, expect, it, afterAll, jest } from "bun:test";

const MockTodoService = {
  getTodos: jest.fn().mockReturnValue(
    of([
      { id: "1", text: "todo 1" },
      { id: "2", text: "todo 2" },
    ])
  ),
  updateTodo: jest.fn().mockReturnValue(of(undefined)),
  deleteTodo: jest.fn().mockReturnValue(of(undefined)),
  addTodo: jest.fn().mockReturnValue(
    of({
      id: "2",
      text: "new todo",
    })
  ),
};

describe("TodosPresenter", () => {
  afterAll(() => {
    container.mock({});
  });

  describe("loadTodos", () => {
    it("loads todos from the service", () => {
      container.mock({
        ITodoService: () => MockTodoService,
      });
      const todosPresenter = new TodosPresenter();

      expect(todosPresenter.viewModel.state.get().todos).toEqual([]);

      todosPresenter.loadTodos();

      expect(todosPresenter.viewModel.state.get().todos).toEqual([
        { id: "1", text: "todo 1" },
        { id: "2", text: "todo 2" },
      ]);
    });
  });

  test("user can edit todo", () => {
    const todosPresenter = new TodosPresenter();
    todosPresenter.loadTodos();

    expect(todosPresenter.isTodoInEditMode("2")).toBe(false);

    todosPresenter.handleEdit({ id: "2", text: "todo 2" });

    expect(todosPresenter.isTodoInEditMode("2")).toBe(true);

    todosPresenter.handleTodoTextChange("new todo 2");

    MockTodoService.getTodos.mockReturnValue(
      of([
        { id: "1", text: "todo 1" },
        { id: "2", text: "new todo 2" },
      ])
    );

    todosPresenter.handleSubmit();

    expect(todosPresenter.viewModel.state.get().todos).toEqual([
      { id: "1", text: "todo 1" },
      { id: "2", text: "new todo 2" },
    ]);
  });

  test("user can delete todo", () => {
    const todosPresenter = new TodosPresenter();

    MockTodoService.getTodos.mockReturnValue(of([{ id: "1", text: "todo 1" }]));
    todosPresenter.loadTodos();

    expect(todosPresenter.viewModel.state.get().todos).toEqual([
      { id: "1", text: "todo 1" },
    ]);

    MockTodoService.getTodos.mockReturnValue(of([]));

    todosPresenter.handleDelete("2");

    expect(todosPresenter.viewModel.state.get().todos).toEqual([]);
  });

  test("user can add todo", () => {
    const todosPresenter = new TodosPresenter();

    MockTodoService.getTodos.mockReturnValue(of([{ id: "1", text: "todo 1" }]));
    todosPresenter.loadTodos();

    todosPresenter.handleNewTodoTextChange("new todo");
    MockTodoService.getTodos.mockReturnValue(
      of([
        { id: "1", text: "todo 1" },
        { id: "2", text: "new todo" },
      ])
    );
    todosPresenter.handleAddTodo();

    expect(todosPresenter.viewModel.state.get().todos).toEqual([
      { id: "1", text: "todo 1" },
      { id: "2", text: "new todo" },
    ]);
  });
});
