import ChatWidget from '../components/ChatWidget';

export default function Home() {
    return (
        <section className="home-page">
            <div className="hero">
                <img src="/images/hero-bg.jpg" alt="Здание суда" className="hero-img" />
                <div className="hero-overlay">
                    <h1>Консультант Арбитражного суда</h1>
                    <p>Быстрые ответы на ваши вопросы о судопроизводстве</p>
                </div>
            </div>
            <div className="chat-section">
                <h2>Задайте вопрос онлайн</h2>
                <ChatWidget />
            </div>
        </section>
    );
}