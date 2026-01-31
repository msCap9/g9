import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 500));

        const result = login(username, password);

        if (!result.success) {
            setError(result.error);
        }
        setIsLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                {/* Заголовок */}
                <div style={{
                    padding: '40px 40px 30px',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 20px',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        fontWeight: '800',
                        color: 'white',
                        boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
                    }}>
                        G9
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px'
                    }}>
                        G9
                    </h1>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '14px'
                    }}>
                        Система управления клиентами
                    </p>
                </div>

                {/* Форма */}
                <form onSubmit={handleSubmit} style={{ padding: '30px 40px 40px' }}>
                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            color: '#ef4444',
                            fontSize: '14px',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Логин</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите логин"
                            required
                            autoFocus
                            style={{ fontSize: '16px', padding: '14px 16px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Пароль</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            required
                            style={{ fontSize: '16px', padding: '14px 16px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            marginTop: '10px'
                        }}
                    >
                        {isLoading ? '⏳ Вход...' : '🔓 Войти в систему'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
