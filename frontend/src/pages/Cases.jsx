import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Cases() {
    const [caseNumber, setCaseNumber] = useState('');
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmed = caseNumber.trim();
        if (!trimmed) {
            setError('Введите номер дела');
            return;
        }
        setLoading(true);
        setError(null);
        setCaseData(null);
        try {
            const { data } = await api.get('/cases/search', {
                params: { case_number: trimmed }
            });
            setCaseData(data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Дело с таким номером не найдено');
            } else if (err.response?.status >= 500) {
                setError(
                    <span>
                        Сервер временно недоступен. Попробуйте позже или перейдите на{' '}
                        <Link to="/">главную страницу</Link>.
                    </span>
                );
            } else {
                setError('Не удалось выполнить поиск. Проверьте формат номера.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cases-page fade-in">
            <div className="cases-header">
                <h2>Поиск дела</h2>
                <p className="cases-subtitle">Введите номер дела для получения информации</p>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="А19-12345/2024"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    className="search-input"
                />
                <button type="submit" disabled={loading} className="btn-gold">
                    {loading ? 'Поиск...' : 'Найти'}
                </button>
            </form>

            {error && <div className="error-msg">{error}</div>}

            {caseData && (
                <div className="case-card fade-in">
                    <h3>Информация о деле</h3>
                    <table className="detail-table">
                        <tbody>
                            <tr><td>Номер дела</td><td>{caseData.case_number}</td></tr>
                            <tr><td>Истец</td><td>{caseData.plaintiff}</td></tr>
                            <tr><td>Ответчик</td><td>{caseData.defendant}</td></tr>
                            <tr><td>Судья</td><td>{caseData.judge_name}</td></tr>
                            <tr><td>Статус</td><td>{caseData.status}</td></tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}