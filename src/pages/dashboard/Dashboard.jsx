import { Outlet } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

function Dashboard() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export default Dashboard;