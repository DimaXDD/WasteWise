import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { AiOutlineStop } from "react-icons/ai";
import { UseDiscount } from "../redux/features/discount/discountSlice";
import { toast } from 'react-toastify';

export const DiscountItem = ({ alldiscount }) => {
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);

    const UseMyDiscount = () => {
        if (!alldiscount) return;

        if (!alldiscount.isAvailable) {
            toast.error(`Недостаточно баллов. Нужно еще ${alldiscount.pointsNeeded} баллов.`);
            return;
        }

        try {
            dispatch(UseDiscount(alldiscount.id));
            setModal(true);
        } catch (error) {
            toast.error("Ошибка при активации промокода.");
            console.error(error);
        }
    };

    const onClose = () => {
        setModal(false);
    };

    if (!alldiscount) {
        return (
            <div className="text-center text-slate-500 py-4">
                Скидок нет...
            </div>
        );
    }

    return (
        <div className="w-full">
            {!modal && (
                <div className={`bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 p-4 ${
                    !alldiscount.isAvailable ? 'opacity-75' : ''
                }`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold text-emerald-600">
                            {alldiscount.discount}
                        </div>
                        <div className="text-sm text-slate-500">
                            {alldiscount.count_for_dnt} баллов
                        </div>
                    </div>
                    
                    {!alldiscount.isAvailable && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">
                                Недостаточно баллов. Нужно еще: <span className="font-semibold">{alldiscount.pointsNeeded}</span> баллов
                            </p>
                        </div>
                    )}
                    
                    <button
                        onClick={UseMyDiscount}
                        disabled={!alldiscount.isAvailable}
                        className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium ${
                            alldiscount.isAvailable 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                        {alldiscount.isAvailable ? 'Получить промокод' : 'Недоступно'}
                    </button>
                </div>
            )}
            {modal && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 relative">
                    <div className="space-y-3">
                        <div className="text-center">
                            <p className="text-slate-600 text-sm">Ваш промокод:</p>
                            <p className="text-xl font-bold text-emerald-600">{alldiscount?.promo_code}</p>
                        </div>
                        <button
                            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                            onClick={onClose}
                        >
                            <AiOutlineStop size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
