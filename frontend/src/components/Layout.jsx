import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'nav-active' : '';

    return (
        <div className="app-wrapper">
            <header className="header">
                <div className="container header-inner">
                    <Link to="/" className="logo">
                        <img src="/images/logo.png" alt="Логотип" height="60" />
                        <span>АС Иркутской области</span>
                    </Link>
                    <nav className="nav">
                        <Link to="/" className={isActive('/')}>Консультант</Link>
                        <Link to="/cases" className={isActive('/cases')}>Дела</Link>
                        <Link to="/schedule" className={isActive('/schedule')}>Расписание</Link>
                        <Link to="/admin" className={isActive('/admin')}>Вход</Link>
                    </nav>
                </div>
            </header>
            <main className="container main-content">
                <Outlet />
            </main>
            <footer className="footer">
                <div className="container">
                    <p>© {new Date().getFullYear()} Арбитражный суд Иркутской области</p>
                    <p>г. Иркутск, ул. Дзержинского, 36А | Единый телефон: (3952) 20-10-10</p>
                </div>
            </footer>
        </div>
    );
}