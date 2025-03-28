import React from 'react';
import Moment from "react-moment";
import {AiFillDelete} from "react-icons/ai";
import {useDispatch} from "react-redux";
import {removePromoCodes} from "../redux/features/promo_code/promo_codeSlice";

export const PromoCodeItem = ({ promo_code }) => {
    const dispatch = useDispatch()

    const removePromoHandler = () => {
        try {
            dispatch(removePromoCodes(promo_code.id))
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg shadow-sm border border-cyan-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium text-cyan-900">
                        {promo_code.Discount.discount}
                    </h3>
                    <p className="text-sm text-cyan-700">
                        <Moment date={promo_code.date_of_add} format="D MMM YYYY"/>
                    </p>
                </div>
                <button
                    onClick={removePromoHandler}
                    className="text-cyan-600 hover:text-red-600 transition-colors duration-200"
                >
                    <AiFillDelete size={20} />
                </button>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-cyan-900 tracking-wider">
                    {promo_code.promo_code}
                </p>
            </div>
        </div>
    )
}
