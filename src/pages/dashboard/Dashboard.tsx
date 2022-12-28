import DashboardLayout from '../../components/dashboard/DashboardLayout';
import IntroAnimation from '../../components/dashboard/IntroAnimation';
import SetStoreNameIfNot from '../../components/dashboard/SetStoreNameIfNot';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <SetStoreNameIfNot />
      <IntroAnimation />
      test
    </DashboardLayout>
  );
};

export default Dashboard;
