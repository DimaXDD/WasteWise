import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import {updatePoint} from "../redux/features/point/pointSlice";
import axios from "../utils/axios";
import {toast} from "react-toastify";

export const UpdatePointPage = () => {
    const dispatch = useDispatch()
    const [timeFrom, setTimeFrom] = useState('')
    const [timeTo, setTimeTo] = useState('')
    const { status } = useSelector((state) => state.point)
    const params = useParams()

    const fetchPoint = useCallback(async () => {
        const { data } = await axios.get(`/Points/${params.id}`)
        const [from, to] = data.time_of_work.split('-')
        setTimeFrom(from)
        setTimeTo(to)
    }, [params.id])

    const submitHandler = () => {
        try {
            const time_of_work = `${timeFrom}-${timeTo}`
            const updatedPoint = { time_of_work, 'id': params.id }
            dispatch(updatePoint(updatedPoint))
            setTimeFrom('')
            setTimeTo('')
        } catch (error) {
            console.log(error)
        }
    }

    const clearFormHandler = () => {
        setTimeFrom('')
        setTimeTo('')
    }

    useEffect(() => {
        fetchPoint()
        if (status) toast(status)
    }, [status])

    return (
        <section className="w-full flex flex-col items-center mt-6">
            <div className="w-full max-w-[1200px] px-6">
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6">
                        <h1 className="text-2xl font-bold text-slate-800 text-center mb-6">
                            Изменение времени работы
                        </h1>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700 mb-2 block">
                                        Открытие:
                                    </span>
                                    <input
                                        type="time"
                                        value={timeFrom}
                                        onChange={(e) => setTimeFrom(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700 mb-2 block">
                                        Закрытие:
                                    </span>
                                    <input
                                        type="time"
                                        value={timeTo}
                                        onChange={(e) => setTimeTo(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </label>
                            </div>

                            <div className="flex gap-4 justify-center mt-6">
                                {timeFrom && timeTo && (
                                    <Link to="/point">
                                        <button
                                            type="button"
                                            onClick={submitHandler}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                                        >
                                            Изменить
                                        </button>
                                    </Link>
                                )}
                                
                                <Link to="/point">
                                    <button
                                        type="button"
                                        onClick={clearFormHandler}
                                        className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200 shadow-sm hover:shadow-md"
                                    >
                                        Отменить
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}