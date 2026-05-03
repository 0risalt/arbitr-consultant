import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            const { data } = await api.post('/admin/login', formData);
            localStorage.setItem('token', data.access_token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-form">
            <h2>Вход для администратора</h2>
            <form onSubmit={handleSubmit}>
                <label>Логин</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                <label>Пароль</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Войти</button>
            </form>
            {error && <div className="error-msg">{error}</div>}
        </div>
    );
}