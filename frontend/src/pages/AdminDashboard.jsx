import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [faqs, setFaqs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Защита: проверка токена
        api.get('/admin/me')
            .catch(() => {
                localStorage.removeItem('token');
                navigate('/admin');
            });
        // Здесь можно грузить список FAQ, для примера просто заглушка
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/admin');
    };

    return (
        <div className="admin-panel">
            <h2>Панель управления</h2>
            <p>Добро пожаловать! Здесь вы можете управлять FAQ, делами и расписанием.</p>
            <button onClick={logout} className="btn-logout">Выйти</button>
        </div>
    );
}