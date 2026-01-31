import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import EmployeeDetail from './pages/EmployeeDetail';
import MapView from './pages/MapView';
import Clients from './pages/Clients';
import Archive from './pages/Archive';
import Users from './pages/Users';
import Login from './pages/Login';

function MobileHeader({ onMenuClick, currentUser }) {
    return (
        <header className="mobile-header">
            <button className="mobile-menu-btn" onClick={onMenuClick}>
                ☰
            </button>
            <span className="mobile-logo">G9</span>
            <div className="mobile-user">
                {currentUser?.avatar || '👤'}
            </div>
        </header>
    );
}

function AppContent() {
    const { currentUser, isLoading, isAdmin } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                    <div style={{ color: 'var(--text-muted)' }}>Загрузка...</div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return <Login />;
    }

    return (
        <div className="app-layout">
            {/* Mobile Header */}
            <MobileHeader onMenuClick={toggleSidebar} currentUser={currentUser} />

            {/* Mobile Overlay */}
            <div
                className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`}
                onClick={closeSidebar}
            />

            {/* Sidebar */}
            <div className={sidebarOpen ? 'sidebar open' : 'sidebar'}>
                <Sidebar onNavClick={closeSidebar} />
            </div>

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/employee/:id" element={<EmployeeDetail />} />
                    <Route path="/map" element={<MapView />} />
                    <Route path="/archive" element={<Archive />} />
                    {isAdmin && <Route path="/users" element={<Users />} />}
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
