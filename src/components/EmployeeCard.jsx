import { Link } from 'react-router-dom';
import { getRoleClass } from '../data/mockData';

function EmployeeCard({ employee, onEdit, onDelete }) {
    const totalClients = employee.clients.length;
    const inWork = employee.clients.filter(c => c.status === 'В работе').length;
    const ordered = employee.clients.filter(c => c.status === 'Заказал').length;

    return (
        <div className="employee-card fade-in">
            <div className="employee-header">
                <Link to={`/employee/${employee.id}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit', flex: 1 }}>
                    <div className="employee-avatar">
                        {employee.avatar}
                    </div>
                    <div className="employee-info">
                        <h3>{employee.name}</h3>
                        <span className={`employee-role ${getRoleClass(employee.role)}`}>
                            {employee.role}
                        </span>
                    </div>
                </Link>
                {onEdit && onDelete && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className="btn-icon"
                            onClick={(e) => { e.stopPropagation(); onEdit(); }}
                            title="Редактировать"
                        >
                            ✏️
                        </button>
                        <button
                            className="btn-icon"
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            title="Удалить"
                        >
                            🗑️
                        </button>
                    </div>
                )}
            </div>

            <div className="employee-stats">
                <div className="employee-stat">
                    <div className="employee-stat-value">{totalClients}</div>
                    <div className="employee-stat-label">Клиентов</div>
                </div>
                <div className="employee-stat">
                    <div className="employee-stat-value" style={{ color: 'var(--status-work)' }}>{inWork}</div>
                    <div className="employee-stat-label">В работе</div>
                </div>
                <div className="employee-stat">
                    <div className="employee-stat-value" style={{ color: 'var(--status-ordered)' }}>{ordered}</div>
                    <div className="employee-stat-label">Заказал</div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeCard;
