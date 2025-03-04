import { Observable } from 'rxjs';
import OrderModel from '../../entities/orders/OrderModel';

interface IOrderService {
  getOrders: () => Observable<OrderModel[]>;
}

export default IOrderService;
