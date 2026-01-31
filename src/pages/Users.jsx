import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EMPLOYEE_ROLES = ['Госы', 'Закрывающий', 'ФСБ'];

function Users() {
    const { users, addUser, updateUser, deleteUser, currentUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        role: 'Госы'
    });

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                password: '',
                name: user.name,
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                password: '',
                name: '',
                role: 'Госы'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.username) {
            alert('Заполните все обязательные поля');
            return;
        }

        if (!editingUser && !formData.password) {
            alert('Введите пароль для нового пользователя');
            return;
        }

        try {
            if (editingUser) {
                const updateData = {
                    name: formData.name,
                    username: formData.username,
                    role: formData.role
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                const success = await updateUser(editingUser.id, updateData);
                if (!success) {
                    alert('Ошибка при обновлении пользователя');
                    return;
                }
            } else {
                const success = await addUser(formData);
                if (!success) {
                    alert('Ошибка при добавлении пользователя. Возможно, логин уже занят.');
                    return;
                }
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error:', error);
            alert('Произошла ошибка');
        }
    };

    const handleDelete = async (user) => {
        if (user.role === 'admin') {
            alert('Нельзя удалить администратора');
            return;
        }
        if (confirm(`Удалить пользователя ${user.name}?`)) {
            try {
                const success = await deleteUser(user.id);
                if (!success) {
                    alert('Ошибка при удалении');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Произошла ошибка');
            }
        }
    };

    // Защита от undefined
    const usersList = users || [];
    const employees = usersList.filter(u => u.role !== 'admin');
    const admins = usersList.filter(u => u.role === 'admin');

    return (
        <div className="fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">👥 Управление пользователями</h1>
                    <p className="page-subtitle">Создание и управление аккаунтами сотрудников</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    + Добавить сотрудника
                </button>
            </div>

            {/* Статистика */}
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
                <div className="stat-card">
                    <div className="stat-icon purple">👑</div>
                    <div className="stat-value">{admins.length}</div>
                    <div className="stat-label">Администраторов</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue">👥</div>
                    <div className="stat-value">{employees.length}</div>
                    <div className="stat-label">Сотрудников</div>
                </div>
            </div>

            {/* Администраторы */}
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>👑 Администраторы</h3>
            <div className="employees-grid" style={{ marginBottom: '32px' }}>
                {admins.map(user => (
                    <div key={user.id} className="employee-card">
                        <div className="employee-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="employee-avatar" style={{ fontSize: '32px' }}>
                                    {user.avatar}
                                </div>
                                <div className="employee-info">
                                    <h3>{user.name}</h3>
                                    <span className="employee-role" style={{ color: 'var(--accent-primary)' }}>
                                        Администратор
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                Логин: <strong>{user.username}</strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Сотрудники */}
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>👥 Сотрудники</h3>
            {employees.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">👤</div>
                    <div className="empty-state-title">Сотрудники не добавлены</div>
                    <p style={{ color: 'var(--text-muted)' }}>Добавьте первого сотрудника</p>
                </div>
            ) : (
                <div className="employees-grid">
                    {employees.map(user => (
                        <div key={user.id} className="employee-card">
                            <div className="employee-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div className="employee-avatar" style={{ fontSize: '32px' }}>
                                        {user.avatar}
                                    </div>
                                    <div className="employee-info">
                                        <h3>{user.name}</h3>
                                        <span className="employee-role">{user.role}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleOpenModal(user)}
                                        title="Редактировать"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDelete(user)}
                                        title="Удалить"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    Логин: <strong>{user.username}</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Модальное окно */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingUser ? '✏️ Редактировать' : '+ Новый сотрудник'}
                            </h2>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">ФИО сотрудника *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Иванов Иван Иванович"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Роль *</label>
                                    <select
                                        name="role"
                                        className="form-select"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        {EMPLOYEE_ROLES.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Логин *</label>
                                    <input
                                        type="text"
                                        name="username"
                                        className="form-input"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="ivanov"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Пароль {editingUser ? '(оставьте пустым, если не меняете)' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div style={{
                                    padding: '12px',
                                    background: 'var(--bg-glass)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '13px',
                                    color: 'var(--text-secondary)'
                                }}>
                                    ℹ️ Сотрудник сможет входить в систему и управлять своими клиентами
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Отмена
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingUser ? 'Сохранить' : 'Создать'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;
