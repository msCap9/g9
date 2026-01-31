import { useState, useEffect } from 'react';

function formatMoney(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(amount || 0);
}

// Операторы связи
const OPERATORS = ['МТС', 'Билайн', 'МегаФон', 'Теле2', 'Yota', 'Ростелеком', 'Другой'];

// Типы телефонов
const PHONE_TYPES = ['Смартфон', 'Кнопочный'];

// Виды средств
const FUND_TYPES = ['Вклад', 'Карта', 'Наличка'];

// Банки для вкладов
const BANKS = [
    'Сбербанк',
    'ВТБ',
    'Газпромбанк',
    'Альфа-Банк',
    'Россельхозбанк',
    'Московский Кредитный Банк',
    'Открытие',
    'Совкомбанк',
    'Росбанк',
    'Райффайзен Банк',
    'Тинькофф',
    'Промсвязьбанк',
    'Почта Банк',
    'Ренессанс Кредит',
    'Хоум Кредит Банк',
    'Другой'
];

function ClientModal({ client, onSave, onClose }) {
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        phone: '',
        address: '',
        city: 'Москва',
        phone_type: 'Смартфон',
        operator: 'МТС',
        status: 'Новый',
        validity: 'Валид',
        notes: '',
        funds: [{ type: 'Вклад', amount: 0, bank: 'Сбербанк' }]
    });

    useEffect(() => {
        if (client) {
            setFormData({
                ...client,
                phone_type: client.phone_type || 'Смартфон',
                operator: client.operator || 'МТС',
                funds: client.funds && client.funds.length > 0
                    ? client.funds.map(f => ({
                        ...f,
                        bank: f.type === 'Вклад' ? (f.bank || 'Сбербанк') : undefined
                    }))
                    : [{ type: 'Вклад', amount: client.amount || 0, bank: 'Сбербанк' }]
            });
        } else {
            setFormData({
                id: null,
                name: '',
                phone: '',
                address: '',
                city: 'Москва',
                phone_type: 'Смартфон',
                operator: 'МТС',
                status: 'Новый',
                validity: 'Валид',
                notes: '',
                funds: [{ type: 'Вклад', amount: 0, bank: 'Сбербанк' }]
            });
        }
    }, [client]);

    const handleChange = (e) => {
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
            // Если меняем тип на не-вклад, убираем банк
            if (field === 'type' && value !== 'Вклад') {
                delete newFunds[index].bank;
            }
            // Если меняем на вклад, добавляем банк по умолчанию
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

    const totalAmount = formData.funds.reduce((sum, f) => sum + (f.amount || 0), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) {
            alert('Введите ФИО клиента');
            return;
        }
        onSave({
            ...formData,
            amount: totalAmount,
            funds: formData.funds.filter(f => f.amount > 0)
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {client ? '✏️ Редактировать клиента' : '+ Новый клиент'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">ФИО клиента *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
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
                                    onChange={handleChange}
                                    placeholder="+7 (999) 123-45-67"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">📞 Тип телефона</label>
                                <select
                                    name="phone_type"
                                    className="form-select"
                                    value={formData.phone_type}
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                >
                                    {OPERATORS.map(op => (
                                        <option key={op} value={op}>{op}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">🏙️ Город</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-input"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Адрес</label>
                            <input
                                type="text"
                                name="address"
                                className="form-input"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Статус</label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Новый">🆕 Новый</option>
                                    <option value="В работе">⏳ В работе</option>
                                    <option value="Заказал">✅ Заказал</option>
                                    <option value="Снял">❌ Снял</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Валидность</label>
                                <select
                                    name="validity"
                                    className="form-select"
                                    value={formData.validity}
                                    onChange={handleChange}
                                >
                                    <option value="Валид">✓ Валидный</option>
                                    <option value="Проверка">? Проверка</option>
                                    <option value="Невалид">✗ Невалидный</option>
                                </select>
                            </div>
                        </div>

                        {/* Средства / Вклады */}
                        <div style={{
                            marginTop: '16px',
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
                                    {/* Выбор банка для вклада */}
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
                                    color: totalAmount >= 1000000 ? 'var(--status-ordered)' : 'var(--text-primary)'
                                }}>
                                    {formatMoney(totalAmount)}
                                </span>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label className="form-label">📝 Заметки</label>
                            <textarea
                                name="notes"
                                className="form-textarea"
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {client ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ClientModal;
