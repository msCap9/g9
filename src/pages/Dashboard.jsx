import { useState, useEffect } from 'react';
import EmployeeCard from '../components/EmployeeCard';
import EmployeeModal from '../components/EmployeeModal';
import * as dataStore from '../data/dataStore';

function Dashboard() {
    const [employeeList, setEmployeeList] = useState([]);
    const [clientsCount, setClientsCount] = useState({ total: 0, inWork: 0, ordered: 0 });
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const employees = await dataStore.getEmployees();
            const clients = await dataStore.getClients();

            setEmployeeList(employees);
            setClientsCount({
                total: clients.length,
                inWork: clients.filter(c => c.status === 'В работе').length,
                ordered: clients.filter(c => c.status === 'Заказал').length
            });
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const stats = {
        totalEmployees: employeeList.length,
        totalClients: clientsCount.total,
        inWork: clientsCount.inWork,
        ordered: clientsCount.ordered
    };

    const filteredEmployees = filter === 'all'
        ? employeeList
        : employeeList.filter(e => e.role === filter);

    const handleAddEmployee = () => {
        setEditingEmployee(null);
        setShowModal(true);
    };

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setShowModal(true);
    };

    const handleSaveEmployee = async (employeeData) => {
        try {
            if (editingEmployee) {
                await dataStore.updateEmployee(editingEmployee.id, employeeData);
            } else {
                await dataStore.addEmployee(employeeData);
            }
            await loadData();
        } catch (error) {
            console.error('Error saving employee:', error);
        }
        setShowModal(false);
        setEditingEmployee(null);
    };

    const handleDeleteEmployee = async (employeeId) => {
        if (confirm('Удалить сотрудника? Он будет перемещён в архив.')) {
            try {
                await dataStore.archiveEmployee(employeeId);
                await loadData();
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="fade-in" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <div style={{ color: 'var(--text-muted)' }}>Загрузка данных...</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Панель управления</h1>
                    <p className="page-subtitle">Обзор сотрудников и их клиентов</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddEmployee}>
                    + Добавить сотрудника
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon purple">👥</div>
                    <div className="stat-value">{stats.totalEmployees}</div>
                    <div className="stat-label">Сотрудников</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue">👤</div>
                    <div className="stat-value">{stats.totalClients}</div>
                    <div className="stat-label">Всего клиентов</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">⏳</div>
                    <div className="stat-value">{stats.inWork}</div>
                    <div className="stat-label">В работе</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">✅</div>
                    <div className="stat-value">{stats.ordered}</div>
                    <div className="stat-label">Заказали</div>
                </div>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '12px'
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Сотрудники</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('all')}
                    >
                        Все ({employeeList.length})
                    </button>
                    <button
                        className={`btn ${filter === 'Госы' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('Госы')}
                    >
                        Госы ({employeeList.filter(e => e.role === 'Госы').length})
                    </button>
                    <button
                        className={`btn ${filter === 'Закрывающий' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('Закрывающий')}
                    >
                        Закрывающий ({employeeList.filter(e => e.role === 'Закрывающий').length})
                    </button>
                    <button
                        className={`btn ${filter === 'ФСБ' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('ФСБ')}
                    >
                        ФСБ ({employeeList.filter(e => e.role === 'ФСБ').length})
                    </button>
                </div>
            </div>

            <div className="employees-grid">
                {filteredEmployees.map(employee => (
                    <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onEdit={() => handleEditEmployee(employee)}
                        onDelete={() => handleDeleteEmployee(employee.id)}
                    />
                ))}
            </div>

            {filteredEmployees.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <div className="empty-state-title">Нет сотрудников</div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                        Добавьте первого сотрудника
                    </p>
                    <button className="btn btn-primary" onClick={handleAddEmployee}>
                        + Добавить сотрудника
                    </button>
                </div>
            )}

            {showModal && (
                <EmployeeModal
                    employee={editingEmployee}
                    onSave={handleSaveEmployee}
                    onClose={() => {
                        setShowModal(false);
                        setEditingEmployee(null);
                    }}
                />
            )}
        </div>
    );
}

export default Dashboard;
