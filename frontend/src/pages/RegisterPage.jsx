import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export const RegisterPage = () => {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rep_password, setRepPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (password.length < 9) {
                toast.error('Пароль должен содержать минимум 9 символов');
                return;
            }

            if (password !== rep_password) {
                toast.error('Пароли не совпадают');
                return;
            }

            setIsLoading(true);
            const response = await dispatch(registerUser({ username, email, password }));
            
            if (response.payload?.errors) {
                response.payload.errors.forEach(error => toast.error(error.msg));
                return;
            }

            toast.success('Регистрация прошла успешно! Проверьте вашу почту для активации аккаунта.');
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Произошла ошибка при регистрации');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true);
            const decoded = jwtDecode(credentialResponse.credential);
            const { name, email } = decoded;
            
            const password = Math.random().toString(36).slice(-16);
            
            const response = await dispatch(registerUser({
                username: name,
                email,
                password,
                isGoogleAuth: true
            }));

            if (response.payload?.errors) {
                response.payload.errors.forEach(error => toast.error(error.msg));
                return;
            }

            // Автоматический вход после регистрации
            const loginResponse = await dispatch(loginUser({ email, password }));
            if (loginUser.fulfilled.match(loginResponse)) {
                navigate('/');
            }
        } catch (error) {
            console.error('Google auth error:', error);
            toast.error('Ошибка при регистрации через Google');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error('Ошибка при входе через Google');
    };

    return (
        <div className="w-full min-h-[90vh] flex items-center justify-center px-6 xl:px-24 bg-white">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8 bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1)] transition-all duration-200">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold text-slate-800">Регистрация</h1>
                    <p className="text-slate-600">Создайте свой аккаунт WasteWise</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Имя пользователя
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Введите имя пользователя..."
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm placeholder:text-slate-400
                                focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                required
                            />
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Почта
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Введите почту..."
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm placeholder:text-slate-400
                                focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                required
                            />
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Пароль
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль (минимум 9 символов)..."
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm placeholder:text-slate-400
                                focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                minLength="9"
                                required
                            />
                            {password.length > 0 && password.length < 9 && (
                                <p className="mt-1 text-xs text-red-500">Пароль слишком короткий (минимум 9 символов)</p>
                            )}
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Подтверждение пароля
                            <input
                                type="password"
                                value={rep_password}
                                onChange={(e) => setRepPassword(e.target.value)}
                                placeholder="Повторно введите пароль..."
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm placeholder:text-slate-400
                                focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                minLength="9"
                                required
                            />
                        </label>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        type="submit"
                        disabled={isLoading || !username || !email || password.length < 9 || password !== rep_password}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out shadow-[0_0_0_3px_rgba(16,185,129,0.1)] hover:shadow-[0_0_0_3px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Или зарегистрируйтесь через</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            shape="rectangular"
                            theme="filled_blue"
                            size="large"
                            text="signup_with"
                            width="300"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-center">
                        <Link
                            to="/login"
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            Уже есть аккаунт?
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};