import { createContext, useContext, useEffect, useState } from "react";
import { api, apiPublic } from "../axios/axios";

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const id = sessionStorage.getItem("id")
        const load = async () => {
            try {
                const data = await api.get('/auth/me', { user: { id } })
                setUser(data.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const register = async (formData) => {
        let data;

        if (formData.role == 'ADMIN') {
            data = await apiPublic.post('/auth/register/organizer', formData)
        } else {
            data = await apiPublic.post('/auth/register/volunteer', formData)
        }
        return data;
    }

    const login = async (email, password) => {
        const data = await apiPublic.post('/auth/login', { email, password })
        if (data.status == 'success') {
            setUser(data.data)
            sessionStorage.setItem('rt', data.data.refreshToken);
            sessionStorage.setItem('id', data.data.id);
            sessionStorage.setItem('at', data.data.accessToken);
            return data;
        }
        return new Error(data);
    }

    const logout = () => {
        setUser(null)
        sessionStorage.clear()
        return null;
    }

    const refreshUser = async () => {
        try {
            const data = await api.get("/auth/me");
            if (data?.data) setUser(data.data);
        } catch (_) {}
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, register, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

const defaultAuth = {
    user: null,
    loading: true,
    error: null,
    login: async () => {},
    logout: () => {},
    register: async () => {},
    refreshUser: async () => {},
};

export const useAuth = () => useContext(AuthContext) ?? defaultAuth;