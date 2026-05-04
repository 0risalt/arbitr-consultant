import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [username, setUsername] = useState('');
    const [tab, setTab] = useState('menu'); // menu | faq | cases
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/admin/me')
            .then(res => setUsername(res.data.username))
            .catch(() => {
                localStorage.removeItem('token');
                navigate('/admin');
            });
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/admin');
    };

    return (
        <div className="admin-panel fade-in">
            <h2>Панель управления</h2>
            <p className="welcome-msg">Добро пожаловать, <strong>{username}</strong>!</p>

            {tab === 'menu' && (
                <div className="admin-menu">
                    <Link to="/admin/analytics" className="btn-admin">Аналитика</Link>
                    <button className="btn-admin" onClick={() => setTab('faq')}>Управление FAQ</button>
                    <button className="btn-admin" onClick={() => setTab('cases')}>Управление делами</button>
                    <button className="btn-logout" onClick={logout}>Выйти</button>
                </div>
            )}

            {tab === 'faq' && <FaqManager />}
            {tab === 'cases' && <CasesManager />}
        </div>
    );
}

// ----- Компонент управления FAQ -----
function FaqManager() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ question: '', answer: '', category: '' });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetch = async () => {
        const { data } = await api.get('/admin/faq');
        setItems(data);
        setLoading(false);
    };
    useEffect(() => { fetch(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/admin/faq/${editId}`, form);
            } else {
                await api.post('/admin/faq', form);
            }
            setForm({ question: '', answer: '', category: '' });
            setEditId(null);
            fetch();
        } catch (err) {
            alert(err.message);
        }
    };

    const edit = (item) => {
        setForm({ question: item.question, answer: item.answer, category: item.category || '' });
        setEditId(item.id);
    };

    const remove = async (id) => {
        if (!window.confirm('Удалить запись?')) return;
        await api.delete(`/admin/faq/${id}`);
        fetch();
    };

    return (
        <div>
            <button className="btn-back" onClick={() => window.location.reload()}>← Назад</button>
            <h3>FAQ</h3>
            <form onSubmit={handleSubmit} className="admin-form">
                <input placeholder="Вопрос" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} required />
                <input placeholder="Ответ" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} required />
                <input placeholder="Категория" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                <button className="btn-admin">{editId ? 'Обновить' : 'Добавить'}</button>
                {editId && <button type="button" className="btn-cancel" onClick={() => { setEditId(null); setForm({ question: '', answer: '', category: '' }); }}>Отмена</button>}
            </form>
            <table className="admin-table">
                <thead><tr><th>Вопрос</th><th>Ответ</th><th>Категория</th><th></th></tr></thead>
                <tbody>
                    {items.map(i => (
                        <tr key={i.id}>
                            <td>{i.question}</td>
                            <td>{i.answer}</td>
                            <td>{i.category}</td>
                            <td>
                                <button className="btn-edit" onClick={() => edit(i)}>✎</button>
                                <button className="btn-del" onClick={() => remove(i.id)}>✕</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ----- Компонент управления делами -----
function CasesManager() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ case_number: '', plaintiff: '', defendant: '', judge_name: '', status: 'На рассмотрении' });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetch = async () => {
        const { data } = await api.get('/admin/cases');
        setItems(data);
        setLoading(false);
    };
    useEffect(() => { fetch(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/admin/cases/${editId}`, form);
            } else {
                await api.post('/admin/cases', form);
            }
            setForm({ case_number: '', plaintiff: '', defendant: '', judge_name: '', status: 'На рассмотрении' });
            setEditId(null);
            fetch();
        } catch (err) {
            alert(err.message);
        }
    };

    const edit = (item) => {
        setForm({ case_number: item.case_number, plaintiff: item.plaintiff || '', defendant: item.defendant || '', judge_name: item.judge_name || '', status: item.status || 'На рассмотрении' });
        setEditId(item.id);
    };

    const remove = async (id) => {
        if (!window.confirm('Удалить дело?')) return;
        await api.delete(`/admin/cases/${id}`);
        fetch();
    };

    return (
        <div>
            <button className="btn-back" onClick={() => window.location.reload()}>← Назад</button>
            <h3>Дела</h3>
            <form onSubmit={handleSubmit} className="admin-form">
                <input placeholder="Номер дела" value={form.case_number} onChange={e => setForm({ ...form, case_number: e.target.value })} required />
                <input placeholder="Истец" value={form.plaintiff} onChange={e => setForm({ ...form, plaintiff: e.target.value })} />
                <input placeholder="Ответчик" value={form.defendant} onChange={e => setForm({ ...form, defendant: e.target.value })} />
                <input placeholder="Судья" value={form.judge_name} onChange={e => setForm({ ...form, judge_name: e.target.value })} />
                <input placeholder="Статус" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} />
                <button className="btn-admin">{editId ? 'Обновить' : 'Добавить'}</button>
                {editId && <button type="button" className="btn-cancel" onClick={() => { setEditId(null); setForm({ case_number: '', plaintiff: '', defendant: '', judge_name: '', status: 'На рассмотрении' }); }}>Отмена</button>}
            </form>
            <table className="admin-table">
                <thead><tr><th>Номер</th><th>Истец</th><th>Ответчик</th><th>Судья</th><th>Статус</th><th></th></tr></thead>
                <tbody>
                    {items.map(i => (
                        <tr key={i.id}>
                            <td>{i.case_number}</td>
                            <td>{i.plaintiff}</td>
                            <td>{i.defendant}</td>
                            <td>{i.judge_name}</td>
                            <td>{i.status}</td>
                            <td>
                                <button className="btn-edit" onClick={() => edit(i)}>✎</button>
                                <button className="btn-del" onClick={() => remove(i.id)}>✕</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}