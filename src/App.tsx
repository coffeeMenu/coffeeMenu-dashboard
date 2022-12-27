import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/auth/RequireAuth';
import RequireNotAuth from './components/auth/RequireNotAuth';
import { r } from './modules/routes';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Playground from './Playground';

function App() {
  return (
    <>
      <Routes>
        {/* private routes(Require auth) */}
        <Route element={<RequireAuth />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* Require not auth */}
        <Route element={<RequireNotAuth />}>
          <Route path={r.register} element={<Register />} />
          <Route path={r.login} element={<Login />} />
        </Route>

        {/* public routes */}
        <Route path={'/playground'} element={<Playground />} />

        {/* catch all */}
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  );
}

export default App;
