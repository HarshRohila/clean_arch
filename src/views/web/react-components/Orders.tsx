import { useEffect } from "react";
import { container } from "../../../config/main";
import { useStateStream } from "../../../utils/readOnlyState";
import { OrderModel } from "../../../domain/entities";

function Orders() {
  const viewModel = container.resolve("IOrdersViewModel");

  useEffect(() => {
    viewModel.loadOrders();
  }, []);

  const state = useStateStream(viewModel.ordersState);

  return (
    <ul>
      {state.orders.map((order) => {
        const isEditMode = viewModel.isOrderInEditMode(order.id);

        return (
          <li key={order.id}>
            {isEditMode && <OrderEditForm order={state.editOrderModel!} />}
            {!isEditMode && (
              <>
                {order.desc}
                <button onClick={() => viewModel.handleEdit(order)}>
                  Edit
                </button>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function OrderEditForm(props: { order: OrderModel }) {
  const viewModel = container.resolve("IOrdersViewModel");

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        viewModel.handleSubmit();
      }}
    >
      <input
        type="text"
        value={props.order.desc}
        onChange={(ev) => {
          viewModel.handleOrderDescChange(ev.target.value);
        }}
      />
      <button type="button" onClick={() => viewModel.handleExitEdit()}>
        X
      </button>
      <button type="submit">Save</button>
    </form>
  );
}

export { Orders };
