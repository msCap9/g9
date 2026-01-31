// Mock данные для CRM системы

export const employees = [
    {
        id: 1,
        name: "Александров Дмитрий Сергеевич",
        role: "Госы",
        avatar: "АД",
        clients: [
            {
                id: 101,
                fio: "Петров Иван Алексеевич",
                address: "ул. Ленина, д. 15, кв. 42",
                city: "Москва",
                age: 34,
                phone: "+7 (985) 123-45-67",
                phoneType: "iPhone 14",
                status: "В работе",
                validity: "Валидный",
                notes: "Часто меняет решения, нужно подтверждение",
                amount: 85000,
                coordinates: { lat: 55.7558, lng: 37.6173 }
            },
            {
                id: 102,
                fio: "Сидорова Мария Владимировна",
                address: "пр. Мира, д. 88, кв. 7",
                city: "Москва",
                age: 28,
                phone: "+7 (903) 987-65-43",
                phoneType: "Samsung S23",
                status: "Заказал",
                validity: "Валидный",
                notes: "",
                amount: 120000,
                coordinates: { lat: 55.7720, lng: 37.6304 }
            }
        ]
    },
    {
        id: 2,
        name: "Козлов Артём Игоревич",
        role: "Закрывающий",
        avatar: "КА",
        clients: [
            {
                id: 201,
                fio: "Новиков Сергей Петрович",
                address: "ул. Арбат, д. 22",
                city: "Москва",
                age: 45,
                phone: "+7 (916) 555-12-34",
                phoneType: "Xiaomi 13",
                status: "В работе",
                validity: "Проверка",
                notes: "Подозрительно низкий бюджет, проверить документы",
                amount: 35000,
                coordinates: { lat: 55.7520, lng: 37.5874 }
            },
            {
                id: 202,
                fio: "Белова Анна Николаевна",
                address: "Тверская ул., д. 5, кв. 101",
                city: "Москва",
                age: 31,
                phone: "+7 (926) 777-88-99",
                phoneType: "iPhone 15 Pro",
                status: "Заказал",
                validity: "Валидный",
                notes: "",
                amount: 250000,
                coordinates: { lat: 55.7648, lng: 37.6054 }
            },
            {
                id: 203,
                fio: "Морозов Алексей Дмитриевич",
                address: "ул. Пятницкая, д. 33",
                city: "Москва",
                age: 52,
                phone: "+7 (495) 111-22-33",
                phoneType: "Honor 90",
                status: "Снял",
                validity: "Валидный",
                notes: "Отменил в последний момент, можно вернуть",
                amount: 95000,
                coordinates: { lat: 55.7415, lng: 37.6288 }
            }
        ]
    },
    {
        id: 3,
        name: "Васильев Михаил Андреевич",
        role: "ФСБ",
        avatar: "ВМ",
        clients: [
            {
                id: 301,
                fio: "Кузнецов Павел Викторович",
                address: "Садовая-Спасская ул., д. 12",
                city: "Москва",
                age: 38,
                phone: "+7 (977) 444-55-66",
                phoneType: "Google Pixel 8",
                status: "Новый",
                validity: "Валидный",
                notes: "",
                amount: 150000,
                coordinates: { lat: 55.7721, lng: 37.6495 }
            }
        ]
    },
    {
        id: 4,
        name: "Смирнова Елена Павловна",
        role: "Госы",
        avatar: "СЕ",
        clients: [
            {
                id: 401,
                fio: "Волков Денис Александрович",
                address: "1-я Тверская-Ямская, д. 8",
                city: "Москва",
                age: 29,
                phone: "+7 (964) 222-33-44",
                phoneType: "iPhone 13",
                status: "В работе",
                validity: "Проверка",
                notes: "Ждём подтверждения адреса",
                amount: 67000,
                coordinates: { lat: 55.7713, lng: 37.5953 }
            },
            {
                id: 402,
                fio: "Лебедева Ольга Сергеевна",
                address: "Новый Арбат, д. 19",
                city: "Москва",
                age: 42,
                phone: "+7 (985) 666-77-88",
                phoneType: "Samsung A54",
                status: "Заказал",
                validity: "Валидный",
                notes: "",
                amount: 180000,
                coordinates: { lat: 55.7531, lng: 37.5847 }
            }
        ]
    },
    {
        id: 5,
        name: "Попов Николай Владимирович",
        role: "Закрывающий",
        avatar: "ПН",
        clients: [
            {
                id: 501,
                fio: "Семёнов Виктор Иванович",
                address: "Большая Никитская, д. 44",
                city: "Москва",
                age: 55,
                phone: "+7 (925) 999-00-11",
                phoneType: "Huawei P60",
                status: "Снял",
                validity: "Невалидный",
                notes: "Мошенник, черный список",
                amount: 0,
                coordinates: { lat: 55.7565, lng: 37.6000 }
            },
            {
                id: 502,
                fio: "Федорова Татьяна Михайловна",
                address: "Остоженка, д. 25",
                city: "Москва",
                age: 36,
                phone: "+7 (909) 123-45-00",
                phoneType: "iPhone 14 Pro Max",
                status: "В работе",
                validity: "Валидный",
                notes: "",
                amount: 320000,
                coordinates: { lat: 55.7417, lng: 37.5957 }
            }
        ]
    },
    {
        id: 6,
        name: "Никитин Олег Евгеньевич",
        role: "ФСБ",
        avatar: "НО",
        clients: [
            {
                id: 601,
                fio: "Андреев Кирилл Олегович",
                address: "Пречистенка, д. 32",
                city: "Москва",
                age: 27,
                phone: "+7 (968) 333-44-55",
                phoneType: "OnePlus 12",
                status: "Заказал",
                validity: "Валидный",
                notes: "",
                amount: 145000,
                coordinates: { lat: 55.7403, lng: 37.5901 }
            },
            {
                id: 602,
                fio: "Григорьева Алина Дмитриевна",
                address: "ул. Покровка, д. 16",
                city: "Москва",
                age: 33,
                phone: "+7 (915) 777-22-33",
                phoneType: "Redmi Note 13",
                status: "Новый",
                validity: "Проверка",
                notes: "Первый контакт, ещё не связались",
                amount: 55000,
                coordinates: { lat: 55.7594, lng: 37.6452 }
            },
            {
                id: 603,
                fio: "Макаров Роман Сергеевич",
                address: "Маросейка, д. 7",
                city: "Москва",
                age: 41,
                phone: "+7 (903) 888-99-00",
                phoneType: "iPhone 12",
                status: "В работе",
                validity: "Валидный",
                notes: "VIP клиент, требует особого внимания",
                amount: 500000,
                coordinates: { lat: 55.7575, lng: 37.6384 }
            }
        ]
    },
    {
        id: 7,
        name: "Орлова Ирина Константиновна",
        role: "Госы",
        avatar: "ОИ",
        clients: [
            {
                id: 701,
                fio: "Зайцев Антон Владимирович",
                address: "Cтолешников пер., д. 11",
                city: "Москва",
                age: 39,
                phone: "+7 (926) 444-11-22",
                phoneType: "Samsung S24 Ultra",
                status: "Заказал",
                validity: "Валидный",
                notes: "",
                amount: 275000,
                coordinates: { lat: 55.7624, lng: 37.6150 }
            }
        ]
    },
    {
        id: 8,
        name: "Фёдоров Станислав Викторович",
        role: "Закрывающий",
        avatar: "ФС",
        clients: [
            {
                id: 801,
                fio: "Егоров Максим Александрович",
                address: "Мясницкая ул., д. 24",
                city: "Москва",
                age: 30,
                phone: "+7 (977) 111-00-99",
                phoneType: "Poco X6",
                status: "В работе",
                validity: "Валидный",
                notes: "Торгуется по цене",
                amount: 78000,
                coordinates: { lat: 55.7627, lng: 37.6340 }
            },
            {
                id: 802,
                fio: "Павлова Светлана Игоревна",
                address: "Чистопрудный бульвар, д. 3",
                city: "Москва",
                age: 47,
                phone: "+7 (916) 222-55-77",
                phoneType: "iPhone 15",
                status: "Снял",
                validity: "Проверка",
                notes: "Передумала, просит отсрочку на месяц",
                amount: 110000,
                coordinates: { lat: 55.7625, lng: 37.6446 }
            }
        ]
    },
    {
        id: 9,
        name: "Ковалёв Денис Сергеевич",
        role: "ФСБ",
        avatar: "КД",
        clients: [
            {
                id: 901,
                fio: "Романов Артём Павлович",
                address: "Сретенка, д. 18",
                city: "Москва",
                age: 35,
                phone: "+7 (968) 555-88-11",
                phoneType: "Realme GT 5",
                status: "Новый",
                validity: "Валидный",
                notes: "",
                amount: 92000,
                coordinates: { lat: 55.7681, lng: 37.6325 }
            },
            {
                id: 902,
                fio: "Степанова Юлия Андреевна",
                address: "Цветной бульвар, д. 9",
                city: "Москва",
                age: 26,
                phone: "+7 (905) 333-66-99",
                phoneType: "Nothing Phone 2",
                status: "Заказал",
                validity: "Валидный",
                notes: "",
                amount: 165000,
                coordinates: { lat: 55.7700, lng: 37.6204 }
            }
        ]
    },
    {
        id: 10,
        name: "Сергеева Анастасия Дмитриевна",
        role: "Госы",
        avatar: "СА",
        clients: [
            {
                id: 1001,
                fio: "Дмитриев Евгений Николаевич",
                address: "Трубная ул., д. 21",
                city: "Москва",
                age: 44,
                phone: "+7 (926) 777-44-22",
                phoneType: "iPhone 14 Plus",
                status: "В работе",
                validity: "Проверка",
                notes: "Несколько раз менял номер телефона",
                amount: 88000,
                coordinates: { lat: 55.7686, lng: 37.6255 }
            },
            {
                id: 1002,
                fio: "Николаева Вера Сергеевна",
                address: "Петровка, д. 17",
                city: "Москва",
                age: 50,
                phone: "+7 (985) 888-33-11",
                phoneType: "Samsung A34",
                status: "Заказал",
                validity: "Валидный",
                notes: "",
                amount: 195000,
                coordinates: { lat: 55.7651, lng: 37.6145 }
            }
        ]
    },
    {
        id: 11,
        name: "Титов Антон Михайлович",
        role: "Закрывающий",
        avatar: "ТА",
        clients: [
            {
                id: 1101,
                fio: "Власов Игорь Васильевич",
                address: "Неглинная ул., д. 14",
                city: "Москва",
                age: 32,
                phone: "+7 (903) 111-55-88",
                phoneType: "Motorola Edge 40",
                status: "Снял",
                validity: "Невалидный",
                notes: "Документы оказались фейковые",
                amount: 0,
                coordinates: { lat: 55.7657, lng: 37.6186 }
            }
        ]
    },
    {
        id: 12,
        name: "Беляева Марина Олеговна",
        role: "ФСБ",
        avatar: "БМ",
        clients: [
            {
                id: 1201,
                fio: "Соколов Владимир Петрович",
                address: "Кузнецкий мост, д. 3",
                city: "Москва",
                age: 48,
                phone: "+7 (977) 666-22-44",
                phoneType: "iPhone 13 mini",
                status: "В работе",
                validity: "Валидный",
                notes: "Крупный заказ, нужен контроль",
                amount: 450000,
                coordinates: { lat: 55.7611, lng: 37.6213 }
            },
            {
                id: 1202,
                fio: "Тихонова Екатерина Алексеевна",
                address: "Рождественка, д. 8",
                city: "Москва",
                age: 29,
                phone: "+7 (964) 999-11-55",
                phoneType: "Google Pixel 7a",
                status: "Новый",
                validity: "Проверка",
                notes: "Ожидает обратного звонка",
                amount: 73000,
                coordinates: { lat: 55.7645, lng: 37.6252 }
            },
            {
                id: 1203,
                fio: "Борисов Даниил Сергеевич",
                address: "Большая Дмитровка, д. 26",
                city: "Москва",
                age: 37,
                phone: "+7 (915) 444-77-00",
                phoneType: "Vivo V29",
                status: "Заказал",
                validity: "Валидный",
                notes: "",
                amount: 210000,
                coordinates: { lat: 55.7639, lng: 37.6108 }
            }
        ]
    },
    {
        id: 13,
        name: "Максимов Владислав Андреевич",
        role: "Госы",
        avatar: "МВ",
        clients: [
            {
                id: 1301,
                fio: "Яковлев Егор Романович",
                address: "Тверской бульвар, д. 13",
                city: "Москва",
                age: 25,
                phone: "+7 (926) 888-00-33",
                phoneType: "iPhone SE 3",
                status: "В работе",
                validity: "Валидный",
                notes: "Студент, ограниченный бюджет",
                amount: 25000,
                coordinates: { lat: 55.7639, lng: 37.6018 }
            },
            {
                id: 1302,
                fio: "Крылова Полина Владимировна",
                address: "Страстной бульвар, д. 4",
                city: "Москва",
                age: 34,
                phone: "+7 (985) 222-99-66",
                phoneType: "Samsung Z Flip 5",
                status: "Заказал",
                validity: "Валидный",
                notes: "",
                amount: 185000,
                coordinates: { lat: 55.7669, lng: 37.6077 }
            }
        ]
    },
    {
        id: 14,
        name: "Жуков Роман Витальевич",
        role: "Закрывающий",
        avatar: "ЖР",
        clients: [
            {
                id: 1401,
                fio: "Герасимов Олег Николаевич",
                address: "Петровские линии, д. 2",
                city: "Москва",
                age: 56,
                phone: "+7 (903) 555-22-11",
                phoneType: "Honor Magic 6",
                status: "Снял",
                validity: "Проверка",
                notes: "Просит скидку 20%, пока думаем",
                amount: 140000,
                coordinates: { lat: 55.7631, lng: 37.6173 }
            },
            {
                id: 1402,
                fio: "Медведева Алёна Петровна",
                address: "Камергерский пер., д. 5",
                city: "Москва",
                age: 31,
                phone: "+7 (968) 777-33-88",
                phoneType: "iPhone 15 Pro Max",
                status: "В работе",
                validity: "Валидный",
                notes: "",
                amount: 380000,
                coordinates: { lat: 55.7603, lng: 37.6133 }
            }
        ]
    },
    {
        id: 15,
        name: "Гусева Валентина Александровна",
        role: "ФСБ",
        avatar: "ГВ",
        clients: [
            {
                id: 1501,
                fio: "Шишкин Станислав Дмитриевич",
                address: "Газетный пер., д. 9",
                city: "Москва",
                age: 40,
                phone: "+7 (977) 888-55-22",
                phoneType: "Asus ROG Phone 7",
                status: "Новый",
                validity: "Валидный",
                notes: "",
                amount: 130000,
                coordinates: { lat: 55.7592, lng: 37.6058 }
            },
            {
                id: 1502,
                fio: "Киселёва Наталья Игоревна",
                address: "Большая Лубянка, д. 18",
                city: "Москва",
                age: 38,
                phone: "+7 (905) 111-44-77",
                phoneType: "Samsung S23 FE",
                status: "Заказал",
                validity: "Валидный",
                notes: "",
                amount: 225000,
                coordinates: { lat: 55.7622, lng: 37.6289 }
            }
        ]
    },
    {
        id: 16,
        name: "Антонов Павел Сергеевич",
        role: "Госы",
        avatar: "АП",
        clients: []
    },
    {
        id: 17,
        name: "Ефимова Дарья Андреевна",
        role: "Закрывающий",
        avatar: "ЕД",
        clients: [
            {
                id: 1701,
                fio: "Куликов Арсений Максимович",
                address: "Воздвиженка, д. 6",
                city: "Москва",
                age: 28,
                phone: "+7 (916) 333-88-00",
                phoneType: "Oppo Find X6",
                status: "В работе",
                validity: "Проверка",
                notes: "Ждём подтверждения личности",
                amount: 99000,
                coordinates: { lat: 55.7531, lng: 37.6044 }
            }
        ]
    },
    {
        id: 18,
        name: "Данилов Илья Олегович",
        role: "ФСБ",
        avatar: "ДИ",
        clients: [
            {
                id: 1801,
                fio: "Калинина Виктория Сергеевна",
                address: "Знаменка, д. 11",
                city: "Москва",
                age: 33,
                phone: "+7 (926) 555-99-22",
                phoneType: "iPhone 14",
                status: "Заказал",
                validity: "Валидный",
                notes: "",
                amount: 175000,
                coordinates: { lat: 55.7492, lng: 37.6049 }
            },
            {
                id: 1802,
                fio: "Захаров Тимур Викторович",
                address: "Моховая ул., д. 13",
                city: "Москва",
                age: 46,
                phone: "+7 (985) 444-66-11",
                phoneType: "Xiaomi 14",
                status: "В работе",
                validity: "Валидный",
                notes: "Постоянный клиент, третий заказ",
                amount: 290000,
                coordinates: { lat: 55.7547, lng: 37.6131 }
            }
        ]
    }
];

// Вспомогательные функции
export const getStatusClass = (status) => {
    const statusMap = {
        'В работе': 'status-work',
        'Заказал': 'status-ordered',
        'Снял': 'status-cancelled',
        'Новый': 'status-new',
        'Отменён': 'status-done'
    };
    return statusMap[status] || 'status-new';
};

export const getValidityClass = (validity) => {
    const validityMap = {
        'Валидный': 'validity-valid',
        'Проверка': 'validity-check',
        'Невалидный': 'validity-invalid'
    };
    return validityMap[validity] || 'validity-check';
};

export const getRoleClass = (role) => {
    const roleMap = {
        'Госы': 'role-gosy',
        'Закрывающий': 'role-closer',
        'ФСБ': 'role-fsb'
    };
    return roleMap[role] || 'role-gosy';
};

// Получить всех клиентов
export const getAllClients = () => {
    return employees.flatMap(emp =>
        emp.clients.map(client => ({
            ...client,
            employeeId: emp.id,
            employeeName: emp.name,
            employeeRole: emp.role
        }))
    );
};

// Форматирование денег
export const formatMoney = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(amount);
};

// Статистика
export const getStats = () => {
    const allClients = getAllClients();
    const totalAmount = allClients.reduce((sum, c) => sum + (c.amount || 0), 0);
    return {
        totalEmployees: employees.length,
        totalClients: allClients.length,
        inWork: allClients.filter(c => c.status === 'В работе').length,
        ordered: allClients.filter(c => c.status === 'Заказал').length,
        newClients: allClients.filter(c => c.status === 'Новый').length,
        cancelled: allClients.filter(c => c.status === 'Снял').length,
        totalAmount
    };
};
