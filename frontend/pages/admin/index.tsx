// pages/admin/index.tsx - Admin Dashboard
import { withAuth } from '../../components/auth/withAuth';
import { AdminDashboard } from '../../components/admin/AdminDashboard';

const AdminPage = () => {
  return <AdminDashboard />;
};

export default withAuth(AdminPage, ['admin']);