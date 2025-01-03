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

        try {
            dispatch(UseDiscount(alldiscount.id));

            //toast.success(`Промокод "${alldiscount.promo_code}" активирован, снято ${alldiscount.count_for_dnt} баллов.`);
            
            // Показываем модальное окно
            setModal(true);
        } catch (error) {
            toast.error("Ошибка при активации промокода.");
            console.error(error);
        }
    };

    const onClose = () => {
        // Закрытие модального окна без дополнительного уведомления
        setModal(false);
    };

    if (!alldiscount) {
        return (
            <div className={'text-xl text-center text-cyan-950 py-10'}>
                Скидок нет...
            </div>
        );
    }

    return (
        <div>
            {!modal && (
                <div className={'flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-lime-100 xl:ml-10 rounded-lg gap-2 break-words xl:w-52 xl:h-44 xl:py-3 xl:px-3'}>
                    <div className={'flex items-center justify-center text-center text-cyan-950 xl:text-2xl font-bold opacity-100 mt-5 xl:mt-0 text-sm overflow'}>
                        {alldiscount.discount}
                    </div>
                    <div className={'text-cyan-950 opacity-95 xl:text-xl xl:pl-2 text-xs pl-1'}>
                        Баллы: {alldiscount.count_for_dnt}
                    </div>
                    <button
                        onClick={UseMyDiscount}
                        className='text-medium-gray xl:w-36 xl:mx-8 py-2 w-24 mx-3 border-2 border-almost-black rounded-lg justify-center items-center'>
                        Промокод
                    </button>
                </div>
            )}
            {modal && (
                <div className={'overlayClasses ml-12 xl:ml-5 bg-green-500 flex flex-col border-2 border-green-500 rounded-lg gap-2 break-all xl:h-44 xl:pt-2 xl:w-52 h-32 w-32'}>
                    <div className={'modalClasses text-white'}>
                        <div className={'mt-4 text-center'}>
                            <p className={'text-white opacity-70 text-xl'}>Промокод: </p>
                            <p className={'text-white text-2xl font-semibold'}>{alldiscount?.promo_code}</p>
                        </div>
                        <div className={'flex justify-end text-white pr-2'}>
                            <button
                                className={'flex items-center justify-center gap-2 text-white hover:text-red-800 hover:opacity-100'}
                                onClick={onClose}
                            >
                                <AiOutlineStop />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
