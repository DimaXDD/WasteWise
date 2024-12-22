import React, { useState, useEffect } from 'react'
// import {Link, useNavigate} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addDiscount } from "../redux/features/alldiscount/alldiscountSlice";
import { toast } from 'react-toastify'
import {loginUser} from "../redux/features/auth/authSlice";


export const AddDisсountPage = () => {

    const dispatch = useDispatch()

    const { status } = useSelector((state) => state.alldiscount)

    // const navigate = useNavigate()
    const [discount, setDiscount] = useState('')
    const [count_for_dnt, setCountForDnt] = useState('')
    const [promo_code, setPromoCode] = useState('')
    const navigate = useNavigate();

    // const submitHandler = async () => {
    //     try {
    //         dispatch(addDiscount({ discount, count_for_dnt, promo_code }))
    //         console.log(discount);
    //         console.log(count_for_dnt);
    //         console.log(promo_code);
    //         setDiscount('')
    //         setCountForDnt('')
    //         setPromoCode('')
    //         // navigate('/alldisсount')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(addDiscount({ discount, count_for_dnt, promo_code }));

            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const clearFormHandler = () => {
        setDiscount('')
        setCountForDnt('')
        setPromoCode('')
        // navigate('/alldisсount')
    }

    useEffect(() => {
        if (status) toast(status)
    }, [status])

    return (
        <div>
            <form
                className='xl:w-96 w-80 h-96 mx-auto mt-24 border-2 border-green-500 xl:pt-4 pt-12 rounded-lg '
                onSubmit={(e) => e.preventDefault()}>
                <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>Добавление скидки</h1>

                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                    Скидка:
                    <input
                        type='text'
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder='Введите скидку...'
                        className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                </label>

                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                    Баллы:
                    <input
                        type='number'
                        value={count_for_dnt}
                        onChange={(e) => setCountForDnt(e.target.value)}
                        placeholder='Введите баллы...'
                        className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                </label>

                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                    Промокод:
                    <input
                        type='text'
                        value={promo_code}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder='Введите промокод...'
                        className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                </label>


                <div className='flex gap-8 items-center justify-center mt-4'>
                    {(discount && count_for_dnt && promo_code)
                        ?
                        <button
                            type={'button'}
                            onClick={submitHandler}
                            className={`text-medium-gray px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg `}
                        >
                            Добавить
                        </button>
                        :
                        <></>
                    }

                    <button
                        type={'button'}
                        onClick={clearFormHandler}
                        className='bg-pink-950 text-medium-gray px-2 py-1 xl:px-5 xl:py-2 text-white rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-pink-950'>
                        Отменить
                    </button>
                </div>
            </form>
        </div>
    )
}
