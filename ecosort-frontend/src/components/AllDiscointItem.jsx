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
            toast('Пункт сдачи отходов был удален')
            // window.location.reload();
            // navigate('/')
        } catch (e) {
            console.log(e)
            toast('Пункт сдачи отходов не был удален')
        }
    }

    if(!alldiscount){
    return(
        <div className={'text-xl text-center text-white py-10'}>
            Скидок не существует...
        </div>
    )
}
return (
    <div className={'flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-lime-100 xl:ml-10  rounded-lg gap-2 break-words xl:w-72 xl:h-44 xl:py-3 xl:px-3'}>
        <div className={'text-cyan-950 xl:text-2xl font-bold xl:pl-3 opacity-70 text-xl pl-2 hover:text-cyan-800'}>
            {alldiscount.discount}
        </div>
        <div className={'text-cyan-950 opacity-95 xl:text-xl xl:pl-2 text-xs pl-1'}>
            Баллы: {alldiscount.count_for_dnt}
        </div>
        <div className={'text-cyan-950 opacity-95 xl:text-xl xl:pl-2 text-xs pl-1'}>
            Промокод: {alldiscount.promo_code}
        </div>
        <div className={'flex xl:text-2xl flex-wrap gap-3 mt-2'}>
        <button className={'flex items-center justify-center gap-2 text-lime-950 opacity-60 hover:text-red-800 hover:opacity-100'}>
            <Link to={`/${alldiscount.id}/editdiscount`}>
                <AiTwotoneEdit />
            </Link>
        </button>
        <button
            onClick={removeAllDiscountHandler}
            className={'flex items-center opacity-50 text-lime-950 opacity-60 hover:text-red-800 hover:opacity-100'}>
            <AiFillDelete />
        </button>
        </div>
    </div>
)
}
