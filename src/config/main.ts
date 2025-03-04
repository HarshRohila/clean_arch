import IOrderService from '../domain/use-cases/orders/IOrderService';
import { SingletonContainer } from 'singleton-injection';
import OrdersViewModel from '../views/web/orders/OrdersViewModel';
import IOrdersViewModel from '../views/web/orders/IOrdersViewModel';
import OrderService from '../data/api/orders/OrderService';

const singletonMap = {
  IOrderService: () => new OrderService() as IOrderService,
  IOrdersViewModel: () => new OrdersViewModel() as IOrdersViewModel,
};

export const container = new SingletonContainer(singletonMap);
