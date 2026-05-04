import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer
} from 'recharts';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin');
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="spinner">Загрузка аналитики...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!stats) return null;

  // Подготовка данных для графика успешных/неуспешных
  const successData = [
    { name: 'Успешные', value: stats.successful },
    { name: 'Неуспешные', value: stats.unsuccessful }
  ];

  return (
    <section className="analytics-page fade-in">
      <h2>📊 Аналитика чат-бота</h2>

      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Всего вопросов</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.successful}</span>
          <span className="stat-label">Успешных</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.unsuccessful}</span>
          <span className="stat-label">Неуспешных</span>
        </div>
      </div>

      <div className="chart-container">
        <h3>Успешность ответов</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={successData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#c4a747" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Топ-5 популярных вопросов</h3>
        {stats.top_questions.length > 0 ? (
          <table className="styled-table">
            <thead>
              <tr><th>Вопрос</th><th>Количество</th></tr>
            </thead>
            <tbody>
              {stats.top_questions.map((q, i) => (
                <tr key={i}>
                  <td>{q.question}</td>
                  <td>{q.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Нет данных о вопросах.</p>
        )}
      </div>

      <div className="chart-container">
        <h3>Активность по дням</h3>
        {stats.daily_stats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.daily_stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#1a2b4c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Нет данных по дням.</p>
        )}
      </div>
    </section>
  );
}