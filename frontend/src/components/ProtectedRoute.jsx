import React from 'react';
import { useSelector } from 'react-redux';
import { AccessDeniedPage } from './AccessDeniedPage';

export const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useSelector((state) => state.auth);

    // Показываем загрузку, пока проверяется авторизация
    if (isLoading) {
        return (
            <div className="w-full min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-slate-600">Загрузка...</p>
                </div>
            </div>
        );
    }

    // Показываем страницу-заглушку, если не авторизован
    if (!user) {
        return <AccessDeniedPage />;
    }

    return children;
}; 