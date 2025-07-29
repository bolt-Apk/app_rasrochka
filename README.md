# Авторассрочка - Мобильное приложение для автокредитования

Современное мобильное приложение для покупки автомобилей в рассрочку без переплат.

## 🚀 Функциональность

### Для клиентов:
- 📱 Каталог автомобилей с фильтрацией и поиском
- 🧮 Калькулятор рассрочки с настройкой параметров
- 📝 Подача заявки на кредит онлайн
- 📊 Отслеживание статуса заявки
- 👤 Личный кабинет пользователя

### Для администраторов:
- 🚗 Управление каталогом автомобилей
- 📋 Обработка и управление заявками
- 📈 Аналитика и статистика
- ⚙️ Административная панель

## 🛠 Технологический стек

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Headless UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🏗 Архитектура

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── ui/             # UI компоненты (Button, Input, Card)
│   ├── layout/         # Компоненты макета
│   ├── cars/           # Компоненты для автомобилей
│   ├── applications/   # Компоненты для заявок
│   └── admin/          # Административные компоненты
├── hooks/              # Пользовательские хуки
├── lib/                # Утилиты и конфигурация
├── pages/              # Страницы приложения
└── types/              # TypeScript типы
```

## 🚀 Быстрый старт

1. **Клонирование репозитория**
```bash
git clone <repository-url>
cd autorассрочка
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка Supabase**
   - Создайте проект в [Supabase](https://supabase.com)
   - Скопируйте URL и анонимный ключ
   - Создайте файл `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Запуск приложения**
```bash
npm run dev
```

## 📊 База данных

Приложение использует следующие таблицы:

### `cars` - Автомобили
- `id` (uuid) - Уникальный идентификатор
- `brand` (text) - Марка автомобиля
- `model` (text) - Модель
- `year` (integer) - Год выпуска
- `price` (numeric) - Цена
- `image_url` (text) - Ссылка на изображение
- `engine` (text) - Тип двигателя
- `transmission` (text) - Коробка передач
- `fuel` (text) - Тип топлива

### `loan_applications` - Заявки на кредит
- `id` (uuid) - Уникальный идентификатор
- `car_id` (uuid) - Ссылка на автомобиль
- `full_name` (text) - ФИО клиента
- `phone` (text) - Телефон
- `email` (text) - Email
- `monthly_income` (numeric) - Ежемесячный доход
- `employment_type` (text) - Тип занятости
- `loan_amount` (numeric) - Сумма кредита
- `down_payment` (numeric) - Первоначальный взнос
- `loan_term` (integer) - Срок кредита в месяцах
- `monthly_payment` (numeric) - Ежемесячный платеж
- `status` (text) - Статус заявки

## 🔐 Безопасность

- Row Level Security (RLS) включен для всех таблиц
- Аутентификация через Supabase Auth
- Валидация данных на клиенте и сервере
- Защищенные API endpoints

## 📱 Мобильная адаптация

- Responsive дизайн для всех устройств
- Touch-friendly интерфейс
- Мобильная навигация
- Оптимизация для iOS и Android

## 🎨 UI/UX

- Современный Material Design
- Интуитивная навигация
- Анимации и микровзаимодействия
- Темная и светлая темы
- Accessibility поддержка

## 📈 Производительность

- Lazy loading компонентов
- Оптимизация изображений
- Кэширование данных
- Минификация и сжатие

## 🧪 Тестирование

```bash
npm run test        # Запуск тестов
npm run test:watch  # Тесты в режиме наблюдения
npm run coverage    # Покрытие кода
```

## 🚀 Деплой

```bash
npm run build       # Сборка для продакшена
npm run preview     # Предварительный просмотр
```

## 📝 Демо аккаунты

### Администратор
- Email: `admin@autorassrochka.ru`
- Пароль: `admin123`

### Клиент
- Email: `user@example.com`
- Пароль: `user123`

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Поддержка

- Email: support@autorассрочка.ru
- Телефон: 8 (800) 123-45-67
- Telegram: @autorассрочка_support

---

Сделано с ❤️ для удобной покупки автомобилей в рассрочку