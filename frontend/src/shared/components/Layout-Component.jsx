import { Outlet } from 'react-router-dom';
import { useAuth } from '@/app/useAuth';
import Favicon from '@/shared/components/Favicon-Component';
import Nav from '@/shared/components/Nav-Component';

export default function AppLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="app-layout">
            <header className="dashboard-header">
                <Favicon variant="color" size="header" />
                <div className="dashboard-header__user">
                    <span>{user?.name}</span>
                    <button className="link-button" onClick={logout}>
                        Cerrar sesión
                    </button>
                </div>
            </header>
            <Nav />
            <main className="app-layout__content">
                <Outlet />
            </main>
        </div>
    );
}
