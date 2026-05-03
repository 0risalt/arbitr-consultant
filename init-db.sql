CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION
IF NOT EXISTS pg_trgm;

-- FAQ (часто задаваемые вопросы)
CREATE TABLE faq (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    tsvector tsvector GENERATED ALWAYS AS
(to_tsvector
('russian', question || ' ' || answer)) STORED
);
CREATE INDEX faq_tsvector_idx ON faq USING GIN
(tsvector);
CREATE INDEX faq_trgm_idx ON faq USING GIN
(question gin_trgm_ops);

-- Судебные дела
CREATE TABLE court_cases
(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    plaintiff TEXT,
    defendant TEXT,
    judge_name TEXT,
    status VARCHAR(50) DEFAULT 'На рассмотрении',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Расписание заседаний
CREATE TABLE hearing_schedule
(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    case_id UUID REFERENCES court_cases(id) ON DELETE CASCADE,
    hearing_date TIMESTAMPTZ NOT NULL,
    courtroom VARCHAR(20),
    judge_name TEXT
);

-- История консультаций
CREATE TABLE consultations
(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX consultations_session_idx ON consultations(session_id, created_at);

-- Администраторы
CREATE TABLE admins
(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- Тестовые данные
INSERT INTO faq
    (question, answer, category)
VALUES
    ('Как подать иск в арбитражный суд?', 'Исковое заявление подаётся через систему "Мой арбитр" или лично в канцелярию суда по адресу: г. Иркутск, ул. Дзержинского, 36А.', 'Подача иска'),
    ('Каков размер государственной пошлины?', 'Для имущественных исков пошлина рассчитывается по НК РФ. Минимально — 2000 руб.', 'Пошлины'),
    ('Где найти образец искового заявления?', 'Образцы находятся в разделе "Документы" на официальном сайте суда.', 'Документы'),
    ('Как узнать о движении дела?', 'Воспользуйтесь сервисом "Картотека арбитражных дел" или нашим чат-ботом.', 'Процесс');

INSERT INTO court_cases
    (case_number, plaintiff, defendant, judge_name, status)
VALUES
    ('А19-12345/2024', 'ООО «СибЛес»', 'ИП Кузнецов', 'Иванов И.И.', 'На рассмотрении'),
    ('А19-67890/2024', 'ПАО «ИркутскЭнерго»', 'ООО «СтройГарант»', 'Петрова А.С.', 'Приостановлено');

INSERT INTO hearing_schedule
    (case_id, hearing_date, courtroom, judge_name)
SELECT id, '2024-12-20 10:00:00+08', 'Зал №3', 'Иванов И.И.'
FROM court_cases
WHERE case_number = 'А19-12345/2024';

-- Пароль admin (bcrypt хэш от "admin")
INSERT INTO admins
    (username, password_hash)
VALUES
    ('admin', '$2b$12$3sHT5sGEZf8h9rOqLIKKfO1hZ1yPKN/VGF1b9N1OlKw3GRqLqIz7u');