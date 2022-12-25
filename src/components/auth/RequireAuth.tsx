import { Navigate, Outlet } from 'react-router-dom';
import { pb } from '../../modules/pocketbase';
import { r } from '../../modules/routes';

const RequireAuth = () => {
  if (pb.authStore.token) return <Outlet />;

  return <Navigate to={r.login} />;
};

export default RequireAuth;
