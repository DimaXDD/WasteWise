import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {changeUsername} from "../redux/features/user/userSlice";

export const ChangeUsername = () => {
    const [username, setUsername] = useState('')
    const [newun, setNewun] = useState('')
    const [rep_newun, setRepNewun] = useState('')
    const [password, setPassword] = useState('')

    const { status } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (status) toast(status)
    }, [status])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newun === rep_newun) {
                const updatedUsername = { 
                    'username': username, 
                    'newun': newun, 
                    'password': password
                }

                const response = await dispatch(changeUsername(updatedUsername));

                if (response.payload && response.payload.length > 0) {
                    const validationErrors = response.payload.map((error) => error.msg);
                    toast.error(validationErrors.join(', '));
                } else {
                    toast.success('Имя пользователя успешно изменено')
                    navigate('/profile')
                }
            } else {
                toast.error('Новые имена пользователя не совпадают')
            }
        } catch (error) {
            console.error(error);
            toast.error('Ошибка при изменении имени пользователя')
        }
    };

    return (
        <section className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8">
            <div className="w-full max-w-[400px] px-6">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-800">Изменение имени пользователя</h1>
                        <p className="text-slate-600">Введите данные для изменения имени пользователя</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Текущее имя пользователя
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Введите текущее имя пользователя..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Новое имя пользователя
                            </label>
                            <input
                                type="text"
                                value={newun}
                                onChange={(e) => setNewun(e.target.value)}
                                placeholder="Введите новое имя пользователя..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Повторите новое имя пользователя
                            </label>
                            <input
                                type="text"
                                value={rep_newun}
                                onChange={(e) => setRepNewun(e.target.value)}
                                placeholder="Повторите новое имя пользователя..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Пароль
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link 
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Отменить
                            </Link>
                            <button
                                type="submit"
                                disabled={!username || !newun || !rep_newun || !password}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                                    username && newun && rep_newun && password
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
