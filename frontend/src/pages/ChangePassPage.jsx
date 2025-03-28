import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {changePass} from "../redux/features/user/userSlice";

export const ChangePassPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [new_pass, setNewPass] = useState('')
    const [rep_new_pass, setRepNewPass] = useState('')

    const { status } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (status) toast(status)
    }, [status])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (new_pass === rep_new_pass) {
                const updatedPass = { 
                    'email': email, 
                    'password': password, 
                    'new_pass': new_pass
                }

                const response = await dispatch(changePass(updatedPass));

                if (response.payload && response.payload.length > 0) {
                    const validationErrors = response.payload.map((error) => error.msg);
                    toast.error(validationErrors.join(', '));
                } else {
                    toast.success('Пароль успешно изменен')
                    navigate('/profile')
                }
            } else {
                toast.error('Пароли не совпадают')
            }
        } catch (error) {
            console.error(error);
            toast.error('Ошибка при изменении пароля')
        }
    };

    return (
        <section className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8">
            <div className="w-full max-w-[400px] px-6">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-800">Изменение пароля</h1>
                        <p className="text-slate-600">Введите данные для изменения пароля</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Почта
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Введите почту..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Текущий пароль
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите текущий пароль..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Новый пароль
                            </label>
                            <input
                                type="password"
                                value={new_pass}
                                onChange={(e) => setNewPass(e.target.value)}
                                placeholder="Введите новый пароль..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Повторите новый пароль
                            </label>
                            <input
                                type="password"
                                value={rep_new_pass}
                                onChange={(e) => setRepNewPass(e.target.value)}
                                placeholder="Повторите новый пароль..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link 
                                to="/profile"
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Отменить
                            </Link>
                            <button
                                type="submit"
                                disabled={!email || !password || !new_pass || !rep_new_pass}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                                    email && password && new_pass && rep_new_pass
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Изменить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
