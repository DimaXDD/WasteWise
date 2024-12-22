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
            console.log(e)
        }
    }

    return (
        <div className="flex w-full flex-col mb-1 text-cyan-950 bg-gradient-to-br from-amber-100 to-lime-100 px-2 py-2 rounded-lg">
            <div className="flex flex-wrap justify-between w-full">
                <h3 className="order-1 text-xl">{promo_code.Discount.discount}</h3>
                <h3 className="order-2 text-xl"><Moment date={promo_code.date_of_add} format="D MMM YYYY"/></h3>
            </div>
            <div className={'flex text-3xl items-center justify-center font-bold items-center'}>
                <h1>{promo_code.promo_code}</h1>
            </div>
            <button
                onClick={removePromoHandler}
                className={'flex flex-wrap justify-center gap-2 ml-5 mt-1.5 text-xl text-lime-900 opacity-50 hover:text-red-800 hover:opacity-100'}>
                <AiFillDelete />
            </button>
        </div>


    )
}
