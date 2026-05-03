import { useState, useEffect } from 'react';
import api from '../api';

export default function Schedule() {
    const [hearings, setHearings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/schedule')
            .then(({ data }) => setHearings(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="spinner">Загрузка...</div>;
    if (error) return <div className="error-msg">{error}</div>;

    return (
        <section className="table-section">
            <h2>Расписание заседаний</h2>
            {hearings.length === 0 ? (
                <p>Заседаний не найдено.</p>
            ) : (
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Зал</th>
                                <th>Судья</th>
                                <th>Дело</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hearings.map((h) => (
                                <tr key={h.id}>
                                    <td>{new Date(h.hearing_date).toLocaleString('ru-RU')}</td>
                                    <td>{h.courtroom}</td>
                                    <td>{h.judge_name}</td>
                                    <td>{h.case_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}