import { useState, useEffect } from 'react';
import api from '../api';

export default function Cases() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/cases')
            .then(({ data }) => setCases(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="spinner">Загрузка...</div>;
    if (error) return <div className="error-msg">{error}</div>;

    return (
        <section className="table-section">
            <h2>Судебные дела</h2>
            {cases.length === 0 ? (
                <p>Нет доступных дел.</p>
            ) : (
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Номер дела</th>
                                <th>Истец</th>
                                <th>Ответчик</th>
                                <th>Судья</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.case_number}</td>
                                    <td>{c.plaintiff}</td>
                                    <td>{c.defendant}</td>
                                    <td>{c.judge_name}</td>
                                    <td>{c.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}