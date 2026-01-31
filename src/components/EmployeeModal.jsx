import { useState, useEffect } from 'react';

function EmployeeModal({ employee, onSave, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        role: 'Госы',
        avatar: ''
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name,
                role: employee.role,
                avatar: employee.avatar
            });
        }
    }, [employee]);

    // Генерация аватара из ФИО
    const generateAvatar = (name) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return parts[0][0] + parts[1][0];
        } else if (parts.length === 1 && parts[0].length >= 2) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return 'НН';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            // Автоматически генерируем аватар при изменении имени
            if (name === 'name') {
                updated.avatar = generateAvatar(value);
            }
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: employee?.id || Date.now(),
            clients: employee?.clients || []
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {employee ? 'Редактировать сотрудника' : 'Новый сотрудник'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Превью аватара */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '24px'
                        }}>
                            <div className="employee-avatar" style={{
                                width: '80px',
                                height: '80px',
                                fontSize: '28px'
                            }}>
                                {formData.avatar || 'НН'}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">ФИО сотрудника</label>
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
                            <label className="form-label">Роль</label>
                            <select
                                name="role"
                                className="form-select"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="Госы">👔 Госы</option>
                                <option value="Закрывающий">🎯 Закрывающий</option>
                                <option value="ФСБ">🔒 ФСБ</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {employee ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmployeeModal;
