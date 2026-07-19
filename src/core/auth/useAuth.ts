// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used inside an <AuthProvider>');
    }
    return context;
};