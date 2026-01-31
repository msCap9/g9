import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка пользователей из Supabase
    useEffect(() => {
        loadUsers();

        // Проверяем сохранённую сессию
        const savedUser = localStorage.getItem('g9_current_user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const loadUsers = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: true });

        if (data && !error) {
            setUsers(data);
        }
    };

    const login = async (username, password) => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (data && !error) {
            setCurrentUser(data);
            localStorage.setItem('g9_current_user', JSON.stringify(data));
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('g9_current_user');
    };

    const addUser = async (userData) => {
        if (currentUser?.role !== 'admin') return false;

        const existingUser = users.find(u => u.username === userData.username);
        if (existingUser) return false;

        const avatar = getAvatarByRole(userData.role);

        const { data, error } = await supabase
            .from('users')
            .insert([{ ...userData, avatar }])
            .select()
            .single();

        if (data && !error) {
            setUsers([...users, data]);
            return true;
        }
        return false;
    };

    const updateUser = async (userId, updates) => {
        if (currentUser?.role !== 'admin') return false;

        if (updates.role) {
            updates.avatar = getAvatarByRole(updates.role);
        }

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (data && !error) {
            setUsers(users.map(u => u.id === userId ? data : u));
            return true;
        }
        return false;
    };

    const deleteUser = async (userId) => {
        if (currentUser?.role !== 'admin') return false;

        const userToDelete = users.find(u => u.id === userId);
        if (!userToDelete || userToDelete.role === 'admin') return false;

        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (!error) {
            setUsers(users.filter(u => u.id !== userId));
            return true;
        }
        return false;
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
