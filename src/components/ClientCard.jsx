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

// Цвета операторов
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

// Форматирование средства с банком
const formatFund = (fund) => {
    if (fund.type === 'Вклад' && fund.bank) {
        return `${fund.type} (${fund.bank}): ${formatMoney(fund.amount)}`;
    }
    return `${fund.type}: ${formatMoney(fund.amount)}`;
};

function ClientCard({ client, onEdit, onDelete, onArchive }) {
    return (
        <div className="client-card fade-in">
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
                            <span className="badge" style={{
                                background: getOperatorColor(client.operator),
                                fontSize: '10px'
                            }}>
                                📱 {client.operator}
                            </span>
                        )}
                    </div>
                </div>
                <div className="client-actions">
                    <button className="btn-icon" onClick={() => onEdit(client)} title="Редактировать">
                        ✏️
                    </button>
                    {onArchive && (
                        <button className="btn-icon" onClick={() => onArchive(client.id)} title="В архив">
                            📦
                        </button>
                    )}
                    <button className="btn-icon" onClick={() => onDelete(client.id)} title="Удалить">
                        🗑️
                    </button>
                </div>
            </div>

            <div className="client-body">
                <div className="client-info-grid">
                    <div className="client-info-item">
                        <span className="client-info-label">💰 Баланс</span>
                        <span className="client-info-value" style={{
                            color: (client.amount || 0) >= 1000000 ? 'var(--status-ordered)' : 'var(--text-primary)',
                            fontWeight: '600'
                        }}>
                            {formatMoney(client.amount || 0)}
                        </span>
                    </div>
                    <div className="client-info-item">
                        <span className="client-info-label">📱 Телефон</span>
                        <span className="client-info-value">{client.phone}</span>
                    </div>
                    <div className="client-info-item">
                        <span className="client-info-label">📞 Тип</span>
                        <span className="client-info-value">{client.phone_type || 'Смартфон'}</span>
                    </div>
                    <div className="client-info-item">
                        <span className="client-info-label">🏙️ Город</span>
                        <span className="client-info-value">{client.city || 'Москва'}</span>
                    </div>
                    <div className="client-info-item full-width">
                        <span className="client-info-label">Адрес</span>
                        <span className="client-info-value">{client.address}</span>
                    </div>
                </div>

                {/* Средства клиента */}
                {client.funds && client.funds.length > 0 && (
                    <div style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)'
                    }}>
                        <span style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>💵 Средства:</span>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                            {client.funds.map((fund, idx) => (
                                <span key={idx} className="badge" style={{
                                    background: fund.type === 'Вклад' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                    fontSize: '11px'
                                }}>
                                    {formatFund(fund)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {client.notes && (
                    <div className="client-notes">
                        <div className="client-notes-title">⚠️ Недостатки / Заметки</div>
                        <p className="client-notes-text">{client.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClientCard;
