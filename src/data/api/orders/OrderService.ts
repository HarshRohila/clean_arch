import OrderModel from '../../../domain/entities/orders/OrderModel';
import IOrderService from '../../../domain/use-cases/orders/IOrderService';
import { of } from '../../../libs/rx';

class OrderService implements IOrderService {
  getOrders() {
    const someOrders: OrderModel[] = [
      {
        id: '1',
        desc: 'order 1',
      },
      {
        id: '2',
        desc: 'order 32',
      },
    ];

    return of(someOrders);
  }
}

export default OrderService;
