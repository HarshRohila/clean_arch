import { useEffect } from "react";
import { useStateStream } from "@/utils/state-mgt";
import { Models } from "../ports";
import { ITodosPresenter } from "../presenters/todos";
import { useComponentScoped } from "@/utils/dep-injection";

function Todos() {
  const presenter = useComponentScoped<ITodosPresenter>("ITodosPresenter");

  useEffect(() => {
    presenter.loadTodos();
  }, []);

  const viewModel = presenter.viewModel;
  const state = useStateStream(viewModel.state);
  const newTodoText = useStateStream(viewModel.newTodoText);

  return (
    <>
      <h1>Todos</h1>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          presenter.handleAddTodo();
        }}
      >
        <input
          type="text"
          value={newTodoText.text}
          placeholder={viewModel.labels.newTodoPlaceholder}
          onChange={(ev) => presenter.handleNewTodoTextChange(ev.target.value)}
        />
        <button>{presenter.getAddButtonLabel()}</button>
      </form>
      <ul>
        {state.todos.map((todo) => (
          <li className="todo-item" key={todo.id}>
            <SingleTodo todo={todo} presenter={presenter} />
          </li>
        ))}
      </ul>
    </>
  );
}

function SingleTodo({
  todo,
  presenter,
}: {
  todo: Models.Todo;
  presenter: ITodosPresenter;
}) {
  const isEditMode = presenter.isTodoInEditMode(todo.id);
  const viewModel = presenter.viewModel;
  const state = useStateStream(viewModel.state);

  return (
    <>
      {isEditMode && (
        <TodoEditForm todo={state.currentEditingTodo!} presenter={presenter} />
      )}
      {!isEditMode && (
        <>
          <span className="todo-text">{todo.text}</span>
          <button onClick={() => presenter.handleEdit(todo)}>
            {viewModel.labels.edit}
          </button>
          <button onClick={() => presenter.handleDelete(todo.id)}>
            {presenter.getDeleteButtonLabel(todo.id)}
          </button>
        </>
      )}
    </>
  );
}

function TodoEditForm(props: {
  todo: Models.Todo;
  presenter: ITodosPresenter;
}) {
  const presenter = props.presenter;

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        presenter.handleSubmit();
      }}
    >
      <input
        type="text"
        value={props.todo.text}
        onChange={(ev) => presenter.handleTodoTextChange(ev.target.value)}
      />
      <button type="button" onClick={() => presenter.handleExitEdit()}>
        X
      </button>
      <button type="submit">{presenter.getSaveButtonLabel()}</button>
    </form>
  );
}

export { Todos };
