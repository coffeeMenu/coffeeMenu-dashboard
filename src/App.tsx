import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/auth/RequireAuth';
import { r } from './modules/routes';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Playground from './Playground';

function App() {
  return (
    <>
      <Routes>
        {/* private routes */}
        {/* Require not auth */}
        <Route element={<RequireAuth />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path={r.register} element={<Register />} />
        <Route path={r.login} element={<Login />} />
        <Route path={'/playground'} element={<Playground />} />
        {/* public routes */}
        {/* catch all */}
      </Routes>
    </>
  );
}

export default App;
