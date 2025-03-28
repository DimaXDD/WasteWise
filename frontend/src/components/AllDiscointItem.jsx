import React from 'react';
import {AiFillDelete, AiTwotoneEdit} from "react-icons/ai";
import {useDispatch} from "react-redux";
import {removeAllDiscount} from "../redux/features/alldiscount/alldiscountSlice";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";

export const AllDiscointItem = ({alldiscount}) => {
    const dispatch = useDispatch()

    const removeAllDiscountHandler = () => {
        try {
            dispatch(removeAllDiscount(alldiscount.id))
            toast('Скидка была удалена')
        } catch (e) {
            console.log(e)
            toast('Скидка не была удалена')
        }
    }

    if(!alldiscount){
        return(
            <div className="text-xl text-center text-slate-700 py-10">
                Скидок не существует...
            </div>
        )
    }

    return (
        <div className="group flex flex-col w-[300px] bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors duration-200">
                    {alldiscount.discount}
                </h3>
                
                <div className="space-y-1">
                    <p className="text-sm text-slate-600">
                        Баллы: <span className="font-medium text-emerald-600">{alldiscount.count_for_dnt}</span>
                    </p>
                    <p className="text-sm text-slate-600">
                        Промокод: <span className="font-medium text-emerald-600">{alldiscount.promo_code}</span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 p-3 border-t border-slate-100">
                <Link 
                    to={`/${alldiscount.id}/editdiscount`}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 transition-colors duration-200"
                >
                    <AiTwotoneEdit className="text-lg" />
                    <span className="text-xs font-medium">Редактировать</span>
                </Link>
                <button
                    onClick={removeAllDiscountHandler}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors duration-200"
                >
                    <AiFillDelete className="text-lg" />
                    <span className="text-xs font-medium">Удалить</span>
                </button>
            </div>
        </div>
    )
}
