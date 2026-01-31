import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ClientCard from '../components/ClientCard';
import ClientModal from '../components/ClientModal';
import * as dataStore from '../data/dataStore';

function formatMoney(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(amount || 0);
}

function getRoleClass(role) {
    const classes = {
        'Госы': 'role-gosy',
        'Закрывающий': 'role-closer',
        'ФСБ': 'role-fsb'
    };
    return classes[role] || '';
}

function EmployeeDetail() {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [emp, clientsData] = await Promise.all([
                dataStore.getEmployeeById(id),
                dataStore.getClientsByEmployee(id)
            ]);
            setEmployee(emp);
            setClients(clientsData || []);
        } catch (error) {
            console.error('Error loading employee:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleAddClient = () => {
        setEditingClient(null);
        setShowModal(true);
    };

    const handleEditClient = (client) => {
        setEditingClient(client);
        setShowModal(true);
    };

    const handleSaveClient = async (clientData) => {
        try {
            if (editingClient) {
                await dataStore.updateClient(editingClient.id, clientData);
            } else {
                await dataStore.addClient({
                    ...clientData,
                    employee_id: employee.id
                });
            }
            await loadData();
        } catch (error) {
            console.error('Error saving client:', error);
        }
        setShowModal(false);
        setEditingClient(null);
    };

    const handleDeleteClient = async (clientId) => {
        if (confirm('Удалить клиента? Он будет перемещён в архив.')) {
            await dataStore.archiveClient(clientId);
            await loadData();
        }
    };

    const handleArchiveClient = async (clientId) => {
        if (confirm('Архивировать клиента?')) {
            await dataStore.archiveClient(clientId);
            await loadData();
        }
    };

    if (loading) {
        return (
            <div className="fade-in" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <div style={{ color: 'var(--text-muted)' }}>Загрузка...</div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">Сотрудник не найден</div>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
                    Вернуться на главную
                </Link>
            </div>
        );
    }

    const totalAmount = clients.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);

    return (
        <div className="fade-in">
            <Link to="/" className="back-link">
                ← Назад к списку сотрудников
            </Link>

            <div className="page-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="employee-avatar" style={{
                        width: '80px',
                        height: '80px',
                        fontSize: '28px'
                    }}>
                        👤
                    </div>
                    <div>
                        <h1 className="page-title" style={{ marginBottom: '12px' }}>
                            {employee.name}
                        </h1>
                        <span className={`employee-role ${getRoleClass(employee.role)}`} style={{
                            fontSize: '14px',
                            padding: '6px 16px'
                        }}>
                            {employee.role}
                        </span>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={handleAddClient}>
                    + Добавить клиента
                </button>
            </div>

            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '24px',
                padding: '20px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                flexWrap: 'wrap'
            }}>
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-primary)' }}>
                        {clients.length}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Всего</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border-color)' }} />
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--status-work)' }}>
                        {clients.filter(c => c.status === 'В работе').length}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>В работе</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border-color)' }} />
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--status-ordered)' }}>
                        {clients.filter(c => c.status === 'Заказал').length}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Заказали</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border-color)' }} />
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--status-new)' }}>
                        {clients.filter(c => c.status === 'Новый').length}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Новые</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border-color)' }} />
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--status-ordered)' }}>
                        {formatMoney(totalAmount)}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Общая сумма</div>
                </div>
            </div>

            {clients.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <div className="empty-state-title">У сотрудника пока нет клиентов</div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                        Добавьте первого клиента для этого сотрудника
                    </p>
                    <button className="btn btn-primary" onClick={handleAddClient}>
                        + Добавить клиента
                    </button>
                </div>
            ) : (
                <div className="clients-grid">
                    {clients.map(client => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            onEdit={handleEditClient}
                            onDelete={handleDeleteClient}
                            onArchive={handleArchiveClient}
                        />
                    ))}
                </div>
            )}

            {showModal && (
                <ClientModal
                    client={editingClient}
                    onSave={handleSaveClient}
                    onClose={() => {
                        setShowModal(false);
                        setEditingClient(null);
                    }}
                />
            )}
        </div>
    );
}

export default EmployeeDetail;
