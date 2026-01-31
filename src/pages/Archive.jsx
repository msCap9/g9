import { useState, useEffect } from 'react';
import * as dataStore from '../data/dataStore';

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

function getValidityClass(validity) {
    const classes = {
        'Валид': 'validity-valid',
        'Невалид': 'validity-invalid',
        'Проверка': 'validity-check'
    };
    return classes[validity] || 'validity-check';
}

function Archive() {
    const [archivedClients, setArchivedClients] = useState([]);
    const [archivedEmployees, setArchivedEmployees] = useState([]);
    const [activeTab, setActiveTab] = useState('clients');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [clients, employees] = await Promise.all([
                dataStore.getArchivedClients(),
                dataStore.getArchivedEmployees()
            ]);
            setArchivedClients(clients);
            setArchivedEmployees(employees);
        } catch (error) {
            console.error('Error loading archive:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleRestoreClient = async (clientId) => {
        await dataStore.restoreClient(clientId);
        await loadData();
    };

    const handleDeleteClientPermanently = async (clientId) => {
        if (confirm('Удалить клиента навсегда? Это действие нельзя отменить.')) {
            await dataStore.deleteClient(clientId);
            await loadData();
        }
    };

    const handleRestoreEmployee = async (employeeId) => {
        await dataStore.restoreEmployee(employeeId);
        await loadData();
    };

    const handleDeleteEmployeePermanently = async (employeeId) => {
        if (confirm('Удалить сотрудника навсегда? Это действие нельзя отменить.')) {
            await dataStore.deleteEmployee(employeeId);
            await loadData();
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'Не указано';
        return new Date(isoString).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Фильтрация по поиску
    const filteredClients = archivedClients.filter(client => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            client.name?.toLowerCase().includes(query) ||
            client.phone?.includes(query) ||
            client.address?.toLowerCase().includes(query) ||
            client.city?.toLowerCase().includes(query) ||
            client.operator?.toLowerCase().includes(query)
        );
    });

    const filteredEmployees = archivedEmployees.filter(emp => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return emp.name?.toLowerCase().includes(query);
    });

    if (loading) {
        return (
            <div className="fade-in" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <div style={{ color: 'var(--text-muted)' }}>Загрузка архива...</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">📦 Архив</h1>
                    <p className="page-subtitle">Удалённые клиенты и сотрудники</p>
                </div>
            </div>

            {/* Статистика архива */}
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
                <div className="stat-card">
                    <div className="stat-icon orange">👤</div>
                    <div className="stat-value">{archivedClients.length}</div>
                    <div className="stat-label">Клиентов в архиве</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple">👥</div>
                    <div className="stat-value">{archivedEmployees.length}</div>
                    <div className="stat-label">Сотрудников в архиве</div>
                </div>
            </div>

            {/* Поиск */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="🔍 Поиск в архиве по ФИО, телефону, городу, оператору..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ maxWidth: '450px' }}
                />
            </div>

            {/* Табы */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <button
                    className={`btn ${activeTab === 'clients' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('clients')}
                >
                    👤 Клиенты ({filteredClients.length})
                </button>
                <button
                    className={`btn ${activeTab === 'employees' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('employees')}
                >
                    👥 Сотрудники ({filteredEmployees.length})
                </button>
            </div>

            {/* Список клиентов */}
            {activeTab === 'clients' && (
                <div>
                    {filteredClients.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <div className="empty-state-title">
                                {searchQuery ? 'Ничего не найдено' : 'Архив клиентов пуст'}
                            </div>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {searchQuery ? 'Попробуйте изменить запрос' : 'Удалённые клиенты будут отображаться здесь'}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {filteredClients.map(client => (
                                <div
                                    key={client.id}
                                    className="client-card"
                                    style={{ opacity: 0.85 }}
                                >
                                    <div className="client-header">
                                        <div>
                                            <h4 className="client-name">{client.name}</h4>
                                            <div className="client-badges">
                                                <span className={`badge ${getStatusClass(client.status)}`}>
                                                    {client.status}
                                                </span>
                                                <span className={`badge ${getValidityClass(client.validity)}`}>
                                                    {client.validity}
                                                </span>
                                                {client.operator && (
                                                    <span className="badge" style={{ background: 'var(--accent-primary)' }}>
                                                        📱 {client.operator}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="client-actions">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleRestoreClient(client.id)}
                                                style={{ fontSize: '13px', padding: '8px 16px' }}
                                            >
                                                ↩️ Восстановить
                                            </button>
                                            <button
                                                className="btn-icon"
                                                onClick={() => handleDeleteClientPermanently(client.id)}
                                                title="Удалить навсегда"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <div className="client-body">
                                        <div className="client-info-grid">
                                            <div className="client-info-item">
                                                <span className="client-info-label">💰 Баланс</span>
                                                <span className="client-info-value">{formatMoney(client.amount || 0)}</span>
                                            </div>
                                            <div className="client-info-item">
                                                <span className="client-info-label">📱 Телефон</span>
                                                <span className="client-info-value">{client.phone}</span>
                                            </div>
                                            <div className="client-info-item">
                                                <span className="client-info-label">📞 Тип</span>
                                                <span className="client-info-value">{client.phone_type || 'Не указан'}</span>
                                            </div>
                                            <div className="client-info-item">
                                                <span className="client-info-label">🏙️ Город</span>
                                                <span className="client-info-value">{client.city || 'Москва'}</span>
                                            </div>
                                        </div>
                                        {client.funds && client.funds.length > 0 && (
                                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>💵 Средства:</span>
                                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                                                    {client.funds.map((fund, idx) => (
                                                        <span key={idx} className="badge" style={{ background: 'var(--bg-tertiary)' }}>
                                                            {fund.type}: {formatMoney(fund.amount)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Список сотрудников */}
            {activeTab === 'employees' && (
                <div>
                    {filteredEmployees.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <div className="empty-state-title">
                                {searchQuery ? 'Ничего не найдено' : 'Архив сотрудников пуст'}
                            </div>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {searchQuery ? 'Попробуйте изменить запрос' : 'Удалённые сотрудники будут отображаться здесь'}
                            </p>
                        </div>
                    ) : (
                        <div className="employees-grid">
                            {filteredEmployees.map(employee => (
                                <div
                                    key={employee.id}
                                    className="employee-card"
                                    style={{ opacity: 0.85 }}
                                >
                                    <div className="employee-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div className="employee-avatar">
                                                👤
                                            </div>
                                            <div className="employee-info">
                                                <h3>{employee.name}</h3>
                                                <span className="employee-role">{employee.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
                                        <div style={{
                                            fontSize: '13px',
                                            color: 'var(--text-secondary)',
                                            marginBottom: '12px'
                                        }}>
                                            Клиентов: {employee.clients_count || 0}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleRestoreEmployee(employee.id)}
                                                style={{ flex: 1, fontSize: '13px' }}
                                            >
                                                ↩️ Восстановить
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => handleDeleteEmployeePermanently(employee.id)}
                                                style={{ fontSize: '13px' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Archive;
