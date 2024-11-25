// pages/kitchen/index.tsx - Kitchen Dashboard
import { withAuth } from '../../components/auth/withAuth';
import { OrderList } from '../../components/kitchen/OrderList';

const KitchenPage = () => {
  return <OrderList />;
};

export default withAuth(KitchenPage, ['kitchen', 'admin']);
