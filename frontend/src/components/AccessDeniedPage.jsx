import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AccessDeniedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-[80vh] flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Доступ запрещен</h2>
                    <p className="text-slate-600 mb-6">
                        Авторизуйтесь для работы в системе
                    </p>
                </div>
                
                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                        Войти в систему
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                        Вернуться на главную
                    </button>
                </div>
            </div>
        </div>
    );
}; 