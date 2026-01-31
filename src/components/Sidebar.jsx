import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar({ onNavClick }) {
    const { logout, currentUser, isAdmin } = useAuth();

    const handleNavClick = () => {
        if (onNavClick) onNavClick();
    };

    const handleLogout = () => {
        if (onNavClick) onNavClick();
        logout();
    };

    return (
        <>
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon" style={{
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    borderRadius: '12px',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '800',
                    color: 'white'
                }}>G9</div>
                <span className="sidebar-logo-text" style={{
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '800'
                }}>G9</span>
            </div>

            <div className="sidebar-nav">
                <NavLink
                    to="/"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={handleNavClick}
                    end
                >
                    <span className="nav-icon">📊</span>
                    <span>Дашборд</span>
                </NavLink>

                <NavLink
                    to="/clients"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={handleNavClick}
                >
                    <span className="nav-icon">📋</span>
                    <span>Клиенты</span>
                </NavLink>

                <NavLink
                    to="/map"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={handleNavClick}
                >
                    <span className="nav-icon">🗺️</span>
                    <span>Карта</span>
                </NavLink>

                <NavLink
                    to="/archive"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={handleNavClick}
                >
                    <span className="nav-icon">📦</span>
                    <span>Архив</span>
                </NavLink>

                {/* Только для админа */}
                {isAdmin && (
                    <>
                        <div style={{
                            margin: '16px 0 8px',
                            padding: '0 16px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            color: 'var(--text-muted)'
                        }}>
                            Администрирование
                        </div>
                        <NavLink
                            to="/users"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={handleNavClick}
                        >
                            <span className="nav-icon">👥</span>
                            <span>Пользователи</span>
                        </NavLink>
                    </>
                )}
            </div>

            <div className="sidebar-user-info" style={{
                marginTop: 'auto',
                padding: '16px',
                borderTop: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--bg-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                    }}>
                        {currentUser?.avatar || '👤'}
                    </div>
                    <div>
                        <div style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            maxWidth: '140px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {currentUser?.name || 'Пользователь'}
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: isAdmin ? 'var(--accent-primary)' : 'var(--text-muted)'
                        }}>
                            {isAdmin ? '👑 Админ' : currentUser?.role}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn btn-secondary"
                    style={{
                        width: '100%',
                        fontSize: '13px',
                        padding: '10px'
                    }}
                >
                    🚪 Выйти
                </button>
            </div>
        </>
    );
}

export default Sidebar;
