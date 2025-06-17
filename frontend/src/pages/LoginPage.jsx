import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode"

export const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [validationErrors, setValidationErrors] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { status } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        if (user) navigate('/')
    }, [user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            const response = await dispatch(loginUser({ email, password }));
            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true);
            const decoded = jwtDecode(credentialResponse.credential);
            const { email } = decoded;
            
            const response = await dispatch(loginUser({ 
                email,
                isGoogleAuth: true
            }));

            if (response.payload?.errors) {
                response.payload.errors.forEach(error => toast.error(error.msg));
                return;
            }

            if (response.payload?.message) {
                toast.error(response.payload.message);
                return;
            }

            navigate('/');
        } catch (error) {
            console.error('Google auth error:', error);
            toast.error('Ошибка при входе через Google');
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
                    <h1 className="text-3xl font-bold text-slate-800">Авторизация</h1>
                    <p className="text-slate-600">Войдите в свой аккаунт WasteWise</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Почта
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Введите почту..."
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm placeholder:text-slate-400
                                focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
                                placeholder="Введите пароль..."
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm placeholder:text-slate-400
                                focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                        </label>
                    </div>
                </div>

                <div className="space-y-4">
                    {(email && password) && (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out shadow-[0_0_0_3px_rgba(16,185,129,0.1)] hover:shadow-[0_0_0_3px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
                        </button>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Или войдите через</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            shape="rectangular"
                            theme="filled_blue"
                            size="large"
                            text="signin_with"
                            width="300"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Link
                            to="/register"
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            Нет аккаунта?
                        </Link>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Link to="/change/username">
                            <button className="w-full bg-white hover:bg-slate-50 text-slate-700 px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out border border-slate-200 hover:border-slate-300">
                                Изменить username
                            </button>
                        </Link>
                        <Link to="/change/pass">
                            <button className="w-full bg-white hover:bg-slate-50 text-slate-700 px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out border border-slate-200 hover:border-slate-300">
                                Изменить пароль
                            </button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
