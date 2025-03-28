import React, {useCallback, useEffect, useState} from 'react'
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "../utils/axios";
import {updateDiscount} from "../redux/features/alldiscount/alldiscountSlice";
import { toast } from 'react-toastify'

export const UpdateDiscountPage = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const [discount, setDiscount] = useState('')
    const [count_for_dnt, setCountForDnt] = useState('')
    const [promo_code, setPromoCode] = useState('')
    const { status } = useSelector((state) => state.alldiscount)

    const fetchDiscount = useCallback(async () => {
        const { data } = await axios.get(`/Discounts/${params.id}`)
        setDiscount(data.discount)
        setCountForDnt(data.count_for_dnt)
        setPromoCode(data.promo_code)
    }, [params.id])

    const submitHandler = () => {
        try {
            const updatedDiscount = { 'discount': discount, 'count_for_dnt': count_for_dnt, 'promo_code': promo_code, 'id': params.id }
            dispatch(updateDiscount(updatedDiscount))
            setDiscount('')
            setCountForDnt('')
            setPromoCode('')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDiscount();
        if (status) toast(status);
    }, [status]);

    return (
        <section className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8">
            <div className="w-full max-w-[600px] px-6">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-800">Изменение скидки</h1>
                        <p className="text-slate-600">Обновите информацию о скидке</p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Скидка:
                                </label>
                                <input
                                    type="text"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    placeholder="Введите название скидки"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Баллы:
                                </label>
                                <input
                                    type="number"
                                    value={count_for_dnt}
                                    onChange={(e) => setCountForDnt(e.target.value)}
                                    placeholder="Введите количество баллов"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Промокод:
                                </label>
                                <input
                                    type="text"
                                    value={promo_code}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Введите промокод"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link 
                                to="/alldisсount"
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Отменить
                            </Link>
                            {(promo_code && count_for_dnt && discount) && (
                                <button
                                    onClick={submitHandler}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    Изменить
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
