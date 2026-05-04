import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';

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
                        {/* Ссылка "Вход" убрана */}
                    </nav>
                </div>
            </header>

            <main className="container main-content">
                <Outlet />
            </main>

            <footer className="footer">
                <div className="container footer-container">
                    <div className="footer-text">
                        <p>© {new Date().getFullYear()} Арбитражный суд Иркутской области</p>
                        <p>г. Иркутск, ул. Седова, 76 | Единый телефон: (3952) 20-10-10</p>
                    </div>
                    {/* Иконка замка, ведущая на /admin, выровнена вертикально по центру */}
                    <Link to="/admin" title="Административная панель" className="admin-hidden-link">
                        <FiLock size={16} />
                    </Link>
                </div>
            </footer>
        </div>
    );
}