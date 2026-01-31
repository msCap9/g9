import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as dataStore from '../data/dataStore';

// Операторы связи
const OPERATORS = ['МТС', 'Билайн', 'МегаФон', 'Теле2', 'Yota', 'Ростелеком', 'Другой'];

// Типы телефонов
const PHONE_TYPES = ['Смартфон', 'Кнопочный'];

// Виды средств
const FUND_TYPES = ['Вклад', 'Карта', 'Наличка'];

// Банки для вкладов
const BANKS = [
    'Сбербанк', 'ВТБ', 'Газпромбанк', 'Альфа-Банк', 'Россельхозбанк',
    'Московский Кредитный Банк', 'Открытие', 'Совкомбанк', 'Росбанк',
    'Райффайзен Банк', 'Тинькофф', 'Промсвязьбанк', 'Почта Банк',
    'Ренессанс Кредит', 'Хоум Кредит Банк', 'Другой'
];

// Города России
const CITIES = [
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
    'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
    'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград', 'Краснодар',
    'Саратов', 'Тюмень', 'Тольятти', 'Ижевск', 'Барнаул', 'Ульяновск',
    'Иркутск', 'Хабаровск', 'Ярославль', 'Владивосток', 'Махачкала',
    'Томск', 'Оренбург', 'Кемерово', 'Новокузнецк', 'Рязань', 'Астрахань',
    'Набережные Челны', 'Пенза', 'Липецк', 'Тула', 'Киров', 'Чебоксары',
    'Калининград', 'Брянск', 'Курск', 'Иваново', 'Магнитогорск', 'Тверь',
    'Ставрополь', 'Белгород', 'Сочи'
];

function formatMoney(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(amount || 0);
}

function getStatusClass(status) {
    const classes = {
        'Новый': 'status-new',
        'В работе': 'status-work',
        'Заказал': 'status-ordered',
        'Снял': 'status-cancelled'
    };
    return classes[status] || 'status-new';
}

function Clients() {
    const [allClients, setAllClients] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState('all');
    const [validityFilter, setValidityFilter] = useState('all');
    const [amountFilter, setAmountFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: 'Москва',
        phoneType: 'Смартфон',
        operator: 'МТС',
        employeeId: '',
        status: 'Новый',
        validity: 'Проверка',
        notes: '',
        funds: [{ type: 'Вклад', amount: 0, bank: 'Сбербанк' }]
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [clientsData, employeesData] = await Promise.all([
                dataStore.getClients(),
                dataStore.getEmployees()
            ]);

            // Добавляем имя сотрудника к каждому клиенту
            const clientsWithEmployee = clientsData.map(client => {
                const employee = employeesData.find(e => e.id === client.employee_id);
                return {
                    ...client,
                    employeeName: employee?.name || 'Не назначен'
                };
            });

            setAllClients(clientsWithEmployee);
            setEmployees(employeesData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredClients = useMemo(() => {
        let result = [...allClients];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.name?.toLowerCase().includes(query) ||
                c.phone?.includes(query) ||
                c.address?.toLowerCase().includes(query) ||
                c.city?.toLowerCase().includes(query) ||
                c.operator?.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(c => c.status === statusFilter);
        }

        if (validityFilter !== 'all') {
            result = result.filter(c => c.validity === validityFilter);
        }

        if (amountFilter !== 'all') {
            switch (amountFilter) {
                case 'low':
                    result = result.filter(c => (c.amount || 0) < 50000);
                    break;
                case 'medium':
                    result = result.filter(c => (c.amount || 0) >= 50000 && (c.amount || 0) < 150000);
                    break;
                case 'high':
                    result = result.filter(c => (c.amount || 0) >= 150000 && (c.amount || 0) < 1000000);
                    break;
                case 'vip':
                    result = result.filter(c => (c.amount || 0) >= 1000000);
                    break;
            }
        }

        result.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = (a.name || '').localeCompare(b.name || '');
                    break;
                case 'amount':
                    comparison = (a.amount || 0) - (b.amount || 0);
                    break;
                case 'status':
                    comparison = (a.status || '').localeCompare(b.status || '');
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [allClients, statusFilter, validityFilter, amountFilter, sortBy, sortOrder, searchQuery]);

    const totalAmount = filteredClients.reduce((sum, c) => sum + (c.amount || 0), 0);

    const handleArchiveClient = async (client) => {
        if (confirm(`Архивировать клиента ${client.name}?`)) {
            await dataStore.archiveClient(client.id);
            loadData();
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFundChange = (index, field, value) => {
        setFormData(prev => {
            const newFunds = [...prev.funds];
            newFunds[index] = {
                ...newFunds[index],
                [field]: field === 'amount' ? parseInt(value) || 0 : value
            };
            if (field === 'type' && value !== 'Вклад') {
                delete newFunds[index].bank;
            }
            if (field === 'type' && value === 'Вклад' && !newFunds[index].bank) {
                newFunds[index].bank = 'Сбербанк';
            }
            return { ...prev, funds: newFunds };
        });
    };

    const addFund = () => {
        setFormData(prev => ({
            ...prev,
            funds: [...prev.funds, { type: 'Вклад', amount: 0, bank: 'Сбербанк' }]
        }));
    };

    const removeFund = (index) => {
        setFormData(prev => ({
            ...prev,
            funds: prev.funds.filter((_, i) => i !== index)
        }));
    };

    const totalFundsAmount = formData.funds.reduce((sum, f) => sum + (f.amount || 0), 0);

    const handleAddClient = async () => {
        if (!formData.name || !formData.employeeId) {
            alert('Заполните обязательные поля: ФИО и Сотрудник');
            return;
        }

        const coords = dataStore.geocodeCity(formData.city);

        const newClient = {
            employee_id: formData.employeeId,
            name: formData.name,
            phone: formData.phone || '+7 (000) 000-00-00',
            address: formData.address || 'Не указан',
            city: formData.city,
            phone_type: formData.phoneType,
            operator: formData.operator,
            status: formData.status,
            validity: formData.validity,
            funds: formData.funds.filter(f => f.amount > 0),
            notes: formData.notes,
            coords: coords
        };

        await dataStore.addClient(newClient);
        await loadData();

        setShowAddModal(false);
        setFormData({
            name: '',
            phone: '',
            address: '',
            city: 'Москва',
            phoneType: 'Смартфон',
            operator: 'МТС',
            employeeId: '',
            status: 'Новый',
            validity: 'Проверка',
            notes: '',
            funds: [{ type: 'Вклад', amount: 0, bank: 'Сбербанк' }]
        });
    };

    if (loading) {
        return (
            <div className="fade-in" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <div style={{ color: 'var(--text-muted)' }}>Загрузка клиентов...</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Все клиенты</h1>
                    <p className="page-subtitle">Общий список клиентов всех сотрудников</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    + Добавить клиента
                </button>
            </div>

            <div className="stats-grid" style={{ marginBottom: '24px' }}>
                <div className="stat-card">
                    <div className="stat-icon purple">👤</div>
                    <div className="stat-value">{filteredClients.length}</div>
                    <div className="stat-label">Найдено клиентов</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">💰</div>
                    <div className="stat-value" style={{ fontSize: '24px' }}>{formatMoney(totalAmount)}</div>
                    <div className="stat-label">Общий баланс</div>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    className="form-input search-input"
                    placeholder="🔍 Поиск по ФИО, телефону, городу, оператору..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ maxWidth: '450px' }}
                />
            </div>

            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                flexWrap: 'wrap',
                alignItems: 'flex-end'
            }}>
                <div>
                    <label className="form-label">Статус</label>
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ minWidth: '140px' }}
                    >
                        <option value="all">Все статусы</option>
                        <option value="Новый">🆕 Новый</option>
                        <option value="В работе">⏳ В работе</option>
                        <option value="Заказал">✅ Заказал</option>
                        <option value="Снял">❌ Снял</option>
                    </select>
                </div>

                <div>
                    <label className="form-label">Валидность</label>
                    <select
                        className="form-select"
                        value={validityFilter}
                        onChange={(e) => setValidityFilter(e.target.value)}
                        style={{ minWidth: '140px' }}
                    >
                        <option value="all">Все</option>
                        <option value="Валид">✓ Валидный</option>
                        <option value="Проверка">? Проверка</option>
                        <option value="Невалид">✗ Невалидный</option>
                    </select>
                </div>

                <div>
                    <label className="form-label">Баланс</label>
                    <select
                        className="form-select"
                        value={amountFilter}
                        onChange={(e) => setAmountFilter(e.target.value)}
                        style={{ minWidth: '180px' }}
                    >
                        <option value="all">Любой баланс</option>
                        <option value="low">До 50 000 ₽</option>
                        <option value="medium">50 000 - 150 000 ₽</option>
                        <option value="high">150 000 - 1 000 000 ₽</option>
                        <option value="vip">От 1 000 000 ₽ (VIP)</option>
                    </select>
                </div>

                <div>
                    <label className="form-label">Сортировка</label>
                    <select
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ minWidth: '140px' }}
                    >
                        <option value="name">По ФИО</option>
                        <option value="amount">По балансу</option>
                        <option value="status">По статусу</option>
                    </select>
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                    {sortOrder === 'asc' ? '↑ По возрастанию' : '↓ По убыванию'}
                </button>

                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        setStatusFilter('all');
                        setValidityFilter('all');
                        setAmountFilter('all');
                        setSearchQuery('');
                    }}
                >
                    Сбросить
                </button>
            </div>

            <div style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{
                            background: 'var(--bg-tertiary)',
                            borderBottom: '1px solid var(--border-color)'
                        }}>
                            <th style={thStyle}>ФИО</th>
                            <th style={thStyle}>Оператор</th>
                            <th style={thStyle}>Статус</th>
                            <th style={thStyle}>Баланс</th>
                            <th style={thStyle}>Телефон</th>
                            <th style={thStyle}>Сотрудник</th>
                            <th style={thStyle}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map(client => (
                            <tr
                                key={client.id}
                                style={{
                                    borderBottom: '1px solid var(--border-color)',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-glass)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={tdStyle}>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{client.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {client.city || 'Москва'} • {client.phone_type || 'Смартфон'}
                                        </div>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <span className="badge" style={{
                                        background: getOperatorColor(client.operator),
                                        fontSize: '11px'
                                    }}>
                                        {client.operator || 'МТС'}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <span className={`badge ${getStatusClass(client.status)}`}>
                                        {client.status}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, fontWeight: '600', color: (client.amount || 0) >= 1000000 ? 'var(--status-ordered)' : 'var(--text-primary)' }}>
                                    {formatMoney(client.amount || 0)}
                                </td>
                                <td style={{ ...tdStyle, fontSize: '13px' }}>{client.phone}</td>
                                <td style={tdStyle}>
                                    <Link
                                        to={`/employee/${client.employee_id}`}
                                        style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}
                                    >
                                        {client.employeeName?.split(' ').slice(0, 2).join(' ')}
                                    </Link>
                                </td>
                                <td style={tdStyle}>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleArchiveClient(client)}
                                        title="В архив"
                                    >
                                        📦
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredClients.length === 0 && (
                    <div className="empty-state" style={{ padding: '40px' }}>
                        <div className="empty-state-icon">🔍</div>
                        <div className="empty-state-title">Клиенты не найдены</div>
                        <p style={{ color: 'var(--text-muted)' }}>Попробуйте изменить фильтры</p>
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', maxHeight: '90vh', overflow: 'auto' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">+ Новый клиент</h2>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">ФИО клиента *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    placeholder="Иванов Иван Иванович"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Сотрудник *</label>
                                    <select
                                        name="employeeId"
                                        className="form-select"
                                        value={formData.employeeId}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="">Выберите сотрудника</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.name} ({emp.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">🏙️ Город России</label>
                                    <select
                                        name="city"
                                        className="form-select"
                                        value={formData.city}
                                        onChange={handleFormChange}
                                    >
                                        {CITIES.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Адрес (улица, дом)</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-input"
                                    value={formData.address}
                                    onChange={handleFormChange}
                                    placeholder="ул. Ленина, д. 15, кв. 42"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">📱 Телефон</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={handleFormChange}
                                        placeholder="+7 (999) 123-45-67"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">📞 Тип телефона</label>
                                    <select
                                        name="phoneType"
                                        className="form-select"
                                        value={formData.phoneType}
                                        onChange={handleFormChange}
                                    >
                                        {PHONE_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">📡 Оператор связи</label>
                                    <select
                                        name="operator"
                                        className="form-select"
                                        value={formData.operator}
                                        onChange={handleFormChange}
                                    >
                                        {OPERATORS.map(op => (
                                            <option key={op} value={op}>{op}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Статус</label>
                                    <select
                                        name="status"
                                        className="form-select"
                                        value={formData.status}
                                        onChange={handleFormChange}
                                    >
                                        <option value="Новый">🆕 Новый</option>
                                        <option value="В работе">⏳ В работе</option>
                                        <option value="Заказал">✅ Заказал</option>
                                        <option value="Снял">❌ Снял</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Валидность</label>
                                <select
                                    name="validity"
                                    className="form-select"
                                    value={formData.validity}
                                    onChange={handleFormChange}
                                >
                                    <option value="Валид">✓ Валидный</option>
                                    <option value="Проверка">? Проверка</option>
                                    <option value="Невалид">✗ Невалидный</option>
                                </select>
                            </div>

                            {/* Средства / Вклады */}
                            <div style={{
                                marginTop: '20px',
                                padding: '16px',
                                background: 'var(--bg-glass)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '16px'
                                }}>
                                    <label className="form-label" style={{ marginBottom: 0 }}>💵 Средства клиента</label>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={addFund}
                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                    >
                                        + Добавить
                                    </button>
                                </div>

                                {formData.funds.map((fund, index) => (
                                    <div key={index} style={{ marginBottom: '12px' }}>
                                        <div style={{
                                            display: 'flex',
                                            gap: '12px',
                                            alignItems: 'center'
                                        }}>
                                            <select
                                                className="form-select"
                                                value={fund.type}
                                                onChange={(e) => handleFundChange(index, 'type', e.target.value)}
                                                style={{ flex: 1 }}
                                            >
                                                {FUND_TYPES.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={fund.amount}
                                                onChange={(e) => handleFundChange(index, 'amount', e.target.value)}
                                                placeholder="Сумма"
                                                style={{ flex: 1 }}
                                                min="0"
                                            />
                                            {formData.funds.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    onClick={() => removeFund(index)}
                                                    title="Удалить"
                                                >
                                                    ❌
                                                </button>
                                            )}
                                        </div>
                                        {fund.type === 'Вклад' && (
                                            <div style={{ marginTop: '8px' }}>
                                                <select
                                                    className="form-select"
                                                    value={fund.bank || 'Сбербанк'}
                                                    onChange={(e) => handleFundChange(index, 'bank', e.target.value)}
                                                    style={{ width: '100%' }}
                                                >
                                                    {BANKS.map(bank => (
                                                        <option key={bank} value={bank}>🏦 {bank}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div style={{
                                    marginTop: '16px',
                                    paddingTop: '16px',
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>💰 Итого баланс:</span>
                                    <span style={{
                                        fontSize: '20px',
                                        fontWeight: '700',
                                        color: totalFundsAmount >= 1000000 ? 'var(--status-ordered)' : 'var(--text-primary)'
                                    }}>
                                        {formatMoney(totalFundsAmount)}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '16px' }}>
                                <label className="form-label">Заметки</label>
                                <textarea
                                    name="notes"
                                    className="form-textarea"
                                    value={formData.notes}
                                    onChange={handleFormChange}
                                    placeholder="Дополнительная информация..."
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                Отмена
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleAddClient}>
                                Добавить клиента
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const getOperatorColor = (operator) => {
    const colors = {
        'МТС': '#e30613',
        'Билайн': '#ffcc00',
        'МегаФон': '#00b956',
        'Теле2': '#1f2229',
        'Yota': '#00b4ff',
        'Ростелеком': '#0070c0'
    };
    return colors[operator] || 'var(--accent-primary)';
};

const thStyle = {
    padding: '16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--text-secondary)'
};

const tdStyle = {
    padding: '16px',
    fontSize: '14px'
};

export default Clients;
