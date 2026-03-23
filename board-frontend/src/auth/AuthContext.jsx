import { useEffect, useState } from "react";
import {
    SESSION_EXPIRED_EVENT,
    redirectToLogin
} from "../api/http";
import { getSessionUser, login as loginRequest, logout as logoutRequest } from "../api/authApi";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        refreshSession();
    }, []);

    useEffect(() => {
        const handleSessionExpired = () => {
            setCurrentUser(null);
            setAuthLoading(false);
            redirectToLogin();
        };

        window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

        return () => {
            window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
        };
    }, []);

    const refreshSession = async () => {
        setAuthLoading(true);

        try {
            const user = await getSessionUser();
            setCurrentUser(user);
        } catch (error) {
            if (error.status !== 401) {
                console.error(error);
            }
            setCurrentUser(null);
        } finally {
            setAuthLoading(false);
        }
    };

    const login = async (credentials) => {
        const user = await loginRequest(credentials);
        setCurrentUser(user);
        return user;
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } finally {
            setCurrentUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                authLoading,
                login,
                logout,
                refreshSession
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
