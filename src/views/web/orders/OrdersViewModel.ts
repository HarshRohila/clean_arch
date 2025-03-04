import { createState, ReadOnlyState } from '@rx-state-utils/js';
import { container } from '../../../config/main';
import IOrdersViewModel, { OrdersState } from './IOrdersViewModel';
import { take } from 'rxjs';
import { OrderModel } from '../../../domain/entities';

class OrdersViewModel implements IOrdersViewModel {
  private _ordersState = createState<OrdersState>({
    orders: [],
    currentEditOrderId: undefined,
    editOrderModel: undefined,
  });

  ordersState: ReadOnlyState<OrdersState>;
  constructor() {
    this.ordersState = this._ordersState.readOnly();
  }

  handleEdit(updatedOrder: OrderModel) {
    this._ordersState.update({
      currentEditOrderId: updatedOrder.id,
      editOrderModel: { ...updatedOrder },
    });
  }

  isOrderInEditMode(orderId: string) {
    return this._ordersState.get().currentEditOrderId === orderId;
  }

  handleSubmit() {
    this._ordersState.update((currState) => ({
      orders: currState.orders.map((o) => {
        if (o.id === currState.editOrderModel!.id) {
          return currState.editOrderModel!;
        }
        return o;
      }),
      currentEditOrderId: undefined,
      editOrderModel: undefined,
    }));
  }
  handleExitEdit() {
    this._ordersState.update({ currentEditOrderId: undefined });
  }
  handleOrderDescChange(newDesc: string) {
    this._ordersState.update((currState) => ({
      editOrderModel: { ...currState.editOrderModel!, desc: newDesc },
    }));
  }

  loadOrders() {
    container
      .resolve('IOrderService')
      .getOrders()
      .pipe(take(1))
      .subscribe((orders) => {
        this._ordersState.update({ orders });
      });
  }
}

export default OrdersViewModel;
