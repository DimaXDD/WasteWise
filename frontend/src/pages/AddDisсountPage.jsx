import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addDiscount, clearStatus } from "../redux/features/alldiscount/alldiscountSlice";
import { toast } from 'react-toastify';

export const AddDisсountPage = () => {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.alldiscount);

    const [discount, setDiscount] = useState('');
    const [count_for_dnt, setCountForDnt] = useState('');
    const [promo_code, setPromoCode] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(addDiscount({ discount, count_for_dnt, promo_code }));
            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            } else {
                toast.success('Скидка успешно добавлена!');
                clearFormHandler();
            }
            dispatch(clearStatus());
        } catch (error) {
            console.log(error);
        }
    };

    const clearFormHandler = () => {
        setDiscount('');
        setCountForDnt('');
        setPromoCode('');
    };

    useEffect(() => {
        if (status) toast(status);
    }, [status]);

    return (
        <section className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8">
            <div className="w-full max-w-[600px] px-6">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-800">Добавление скидки</h1>
                        <p className="text-slate-600">Создайте новую скидку для пользователей</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
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
                            <button
                                type="button"
                                onClick={clearFormHandler}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Отменить
                            </button>
                            {(discount && count_for_dnt && promo_code) && (
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    Добавить
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
