import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {updatePointK} from "../redux/features/point/pointSlice";
import {Link, useParams} from "react-router-dom";
import { toast } from 'react-toastify'

export const UpdateSecretKeyPage = () => {
    const dispatch = useDispatch()
    const [secret_key, setSecretKey] = useState('')
    const { status } = useSelector((state) => state.secretkey)
    const params = useParams()

    const submitHandler = () => {
        try {
            const updatedPointK = { 'secret_key': secret_key, 'id': params.id }
            dispatch(updatePointK(updatedPointK))
            setSecretKey('')
        } catch (error) {
            console.log(error)
        }
    }

    const clearFormHandler = () => {
        setSecretKey('')
    }

    useEffect(() => {
        if (status) toast(status)
    }, [status, secret_key])

    return (
        <section className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8">
            <div className="w-full max-w-[600px] px-6">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-800">Изменение ключа</h1>
                        <p className="text-slate-600">Обновите секретный ключ для пункта приема</p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Секретный ключ:
                                </label>
                                <input
                                    type="text"
                                    value={secret_key}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    placeholder="Введите новый секретный ключ"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link 
                                to="/point"
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Отменить
                            </Link>
                            {secret_key && (
                                <Link to="/point">
                                    <button
                                        onClick={submitHandler}
                                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                    >
                                        Изменить
                                    </button>
                                </Link>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
