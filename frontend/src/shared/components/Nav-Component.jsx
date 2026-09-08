import { NavLink } from 'react-router-dom';

const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/usuarios', label: 'Usuarios' },
    { to: '/productos', label: 'Productos' },
    { to: '/facturas', label: 'Facturas' },
    { to: '/impuestos', label: 'Impuestos' },
    { to: '/metodos-pago', label: 'Métodos de pago' },
    { to: '/canales', label: 'Canales' },
    { to: '/empresa', label: 'Empresa' },
];

export default function Nav() {
    return (
        <nav className="app-nav">
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => 'app-nav__link' + (isActive ? ' app-nav__link--active' : '')}
                >
                    {link.label}
                </NavLink>
            ))}
        </nav>
    );
}
