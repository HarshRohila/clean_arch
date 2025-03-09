import { useEffect } from "react";
import { useStateStream } from "@/utils/state-mgt";
import { Models } from "../ports";
import { ITodosPresenter } from "../todos";
import { useComponentScoped } from "@/utils/dep-injection";

function Todos() {
  const presenter = useComponentScoped<ITodosPresenter>("ITodosPresenter");

  useEffect(() => {
    presenter.loadTodos();
  }, []);

  const viewModel = presenter.viewModel;
  const state = useStateStream(viewModel.state);

  return (
    <ul>
      {state.todos.map((todo) => (
        <li key={todo.id}>
          <SingleTodo todo={todo} presenter={presenter} />
        </li>
      ))}
    </ul>
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
          {todo.text}
          <button onClick={() => presenter.handleEdit(todo)}>
            {viewModel.labels.edit}
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
  const { viewModel } = presenter;

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
      <button type="submit">{viewModel.labels.save}</button>
    </form>
  );
}

export { Todos };
