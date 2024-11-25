// pages/orders/index.tsx - Waiter Orders Page
import { withAuth } from '../../components/auth/withAuth';
import { WaiterOrderList } from '../../components/waiter/WaiterOrderList';

const OrdersPage = () => {
  return <WaiterOrderList />;
};

export default withAuth(OrdersPage, ['waiter', 'admin']);

