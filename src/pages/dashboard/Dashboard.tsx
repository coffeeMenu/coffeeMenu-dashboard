import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import IntroAnimation from '../../components/dashboard/IntroAnimation';
import SetStoreNameIfNot from '../../components/dashboard/SetStoreNameIfNot';

const Dashboard = () => {
  return (
    <>
      <SetStoreNameIfNot />
      <IntroAnimation />
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
