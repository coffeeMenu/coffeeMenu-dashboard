import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/auth/RequireAuth';
import RequireNotAuth from './components/auth/RequireNotAuth';
import CategoriesProvider from './contexts/CategoriesProvider';
import ProductsProvider from './contexts/ProductsProvider';
import { r } from './modules/routes';
import BugReport from './pages/dashboard/BugReport';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardIndex from './pages/dashboard/DashboardIndex';
import Products from './pages/dashboard/products/Products';
import Settings from './pages/dashboard/settings/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Playground from './Playground';

function App() {
    return (
        <>
            <Routes>
                {/* private routes(Require auth) */}
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<Dashboard />}>
                        <Route path={'/'} element={<DashboardIndex />} />
                        <Route
                            path={r.products}
                            element={
                                <ProductsProvider>
                                    <CategoriesProvider>
                                        <Products />
                                    </CategoriesProvider>
                                </ProductsProvider>
                            }
                        />
                        <Route path={r.settings} element={<Settings />} />
                        <Route path={r.bugReport} element={<BugReport />} />
                    </Route>
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
