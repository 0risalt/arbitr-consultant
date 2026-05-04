import { Link } from 'react-router-dom';

const errorInfo = {
    404: {
        title: 'Страница не найдена',
        message:
            'Запрашиваемая страница не существует. Возможно, она была удалена или в адресе допущена опечатка.',
    },
    500: {
        title: 'Внутренняя ошибка сервера',
        message:
            'В данный момент сервер не может обработать запрос. Пожалуйста, повторите попытку позже или обратитесь в канцелярию суда.',
    },
};

export default function ErrorPage({ code = 404 }) {
    const info = errorInfo[code] || errorInfo[404];

    return (
        <div className="error-page fade-in">
            <div className="error-code">{code}</div>
            <h1>{info.title}</h1>
            <p className="error-message">{info.message}</p>
            <div className="error-actions">
                <Link to="/" className="btn-gold">На главную</Link>
                <Link to="/cases" className="btn-outline">Поиск дела</Link>
                <Link to="/schedule" className="btn-outline">Расписание</Link>
            </div>
        </div>
    );
}