import { ReadOnlyState } from '@rx-state-utils/js';
import { OrderModel } from '../../../domain/entities';

interface OrdersState extends Record<string, unknown> {
  orders: OrderModel[];
  currentEditOrderId: string | undefined;
  editOrderModel: OrderModel | undefined;
}

interface IOrdersViewModel {
  ordersState: ReadOnlyState<OrdersState>;
  loadOrders: () => void;
  handleEdit(order: OrderModel): void;
  handleSubmit(): void;
  handleExitEdit(): void;
  handleOrderDescChange(newDesc: string): void;
  isOrderInEditMode(orderId: string): boolean;
}

export default IOrdersViewModel;
export type { OrdersState };
