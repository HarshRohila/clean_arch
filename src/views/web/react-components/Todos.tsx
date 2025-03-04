import { useEffect } from "react";
import { TodoModel } from "@/domain/entities";
import { useStateStream } from "@/utils/readOnlyState";
import { container } from "@/config/main";

function Todos() {
  const viewModel = container.resolve("ITodosViewModel");

  useEffect(() => {
    viewModel.loadTodos();
  }, []);

  const state = useStateStream(viewModel.todosState);

  return (
    <ul>
      {state.todos.map((todo) => {
        const isEditMode = viewModel.isTodoInEditMode(todo.id);

        return (
          <li key={todo.id}>
            {isEditMode && <TodoEditForm todo={state.currentEditingTodo!} />}
            {!isEditMode && (
              <>
                {todo.text}
                <button onClick={() => viewModel.handleEdit(todo)}>Edit</button>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function TodoEditForm(props: { todo: TodoModel }) {
  const viewModel = container.resolve("ITodosViewModel");

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        viewModel.handleSubmit();
      }}
    >
      <input
        type="text"
        value={props.todo.text}
        onChange={(ev) => {
          viewModel.handleTodoTextChange(ev.target.value);
        }}
      />
      <button type="button" onClick={() => viewModel.handleExitEdit()}>
        X
      </button>
      <button type="submit">Save</button>
    </form>
  );
}

export { Todos };
