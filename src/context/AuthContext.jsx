import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const USERS_STORAGE_KEY = 'g9_users';
const SESSION_STORAGE_KEY = 'g9_current_user';

// Default admin user
const DEFAULT_USERS = [
    {
        id: 1,
        username: 'admin',
        password: 'admin',
        name: 'Администратор',
        role: 'admin',
        avatar: '👑',
        created_at: new Date().toISOString()
    }
];

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUsers();

        // Check saved session
        const savedUser = localStorage.getItem(SESSION_STORAGE_KEY);
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const loadUsers = () => {
        const stored = localStorage.getItem(USERS_STORAGE_KEY);
        if (stored) {
            setUsers(JSON.parse(stored));
        } else {
            // Initialize with default admin
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
            setUsers(DEFAULT_USERS);
        }
    };

    const saveUsers = (newUsers) => {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
        setUsers(newUsers);
    };

    const login = (username, password) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem(SESSION_STORAGE_KEY);
    };

    const addUser = (userData) => {
        if (currentUser?.role !== 'admin') return false;

        const existingUser = users.find(u => u.username === userData.username);
        if (existingUser) return false;

        const avatar = getAvatarByRole(userData.role);
        const newUser = {
            id: Date.now(),
            ...userData,
            avatar,
            created_at: new Date().toISOString()
        };

        const newUsers = [...users, newUser];
        saveUsers(newUsers);
        return true;
    };

    const updateUser = (userId, updates) => {
        if (currentUser?.role !== 'admin') return false;

        if (updates.role) {
            updates.avatar = getAvatarByRole(updates.role);
        }

        const newUsers = users.map(u =>
            u.id === userId ? { ...u, ...updates } : u
        );
        saveUsers(newUsers);
        return true;
    };

    const deleteUser = (userId) => {
        if (currentUser?.role !== 'admin') return false;

        const userToDelete = users.find(u => u.id === userId);
        if (!userToDelete || userToDelete.role === 'admin') return false;

        const newUsers = users.filter(u => u.id !== userId);
        saveUsers(newUsers);
        return true;
    };

    const getAvatarByRole = (role) => {
        const avatars = {
            'admin': '👑',
            'Госы': '🏛️',
            'Закрывающий': '🔒',
            'ФСБ': '🛡️'
        };
        return avatars[role] || '👤';
    };

    const getEmployees = () => {
        return users.filter(u => u.role !== 'admin');
    };

    const isAdmin = currentUser?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            currentUser,
            users,
            isLoading,
            isAdmin,
            login,
            logout,
            addUser,
            updateUser,
            deleteUser,
            getEmployees,
            refreshUsers: loadUsers
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
