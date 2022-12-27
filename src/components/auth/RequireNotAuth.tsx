import { Navigate, Outlet } from 'react-router-dom';
import { pb } from '../../modules/pocketbase';
import { r } from '../../modules/routes';

const RequireNotAuth = () => {
  if (!pb.authStore.token) return <Outlet />;

  return <Navigate to={'/'} />;
};

export default RequireNotAuth;
