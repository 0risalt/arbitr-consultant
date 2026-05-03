import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

export default function ChatWidget() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const sessionId = useRef(localStorage.getItem('session_id') || uuidv4());
    const messagesEnd = useRef(null);

    useEffect(() => {
        localStorage.setItem('session_id', sessionId.current);
        // Приветственное сообщение
        setMessages([{
            from: 'bot',
            text: 'Здравствуйте! Я консультант Арбитражного суда Иркутской области. Задайте вопрос.'
        }]);
    }, []);

    const scrollToBottom = () => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        const question = input.trim();
        if (question.length < 3) {
            setError('Вопрос должен содержать минимум 3 символа');
            return;
        }
        setError('');
        setInput('');
        const userMessage = { from: 'user', text: question };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        try {
            const { data } = await api.post('/chat/ask', {
                question,
                session_id: sessionId.current
            });
            setMessages(prev => [...prev, { from: 'bot', text: data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { from: 'bot', text: 'Извините, произошла ошибка. Попробуйте позже.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-widget">
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`msg ${msg.from}`}>
                        <div className="bubble">{msg.text}</div>
                    </div>
                ))}
                {loading && <div className="msg bot"><div className="bubble typing">...</div></div>}
                <div ref={messagesEnd} />
            </div>
            <form onSubmit={handleSend} className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Введите вопрос..."
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    <i className="bi bi-send"></i> Отправить
                </button>
            </form>
            {error && <div className="chat-error">{error}</div>}
        </div>
    );
}