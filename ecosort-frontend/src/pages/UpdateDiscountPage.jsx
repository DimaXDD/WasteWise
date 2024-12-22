import React, {useCallback, useEffect, useState} from 'react'
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "../utils/axios";
import {updateDiscount} from "../redux/features/alldiscount/alldiscountSlice";
import { toast } from 'react-toastify'
import { useNavigate} from "react-router-dom";


export const UpdateDiscountPage = () => {

    const dispatch = useDispatch()
    const params = useParams()
    const navigate = useNavigate();
    const [discount, setDiscount] = useState('')
    const [count_for_dnt, setCountForDnt] = useState('')
    const [promo_code, setPromoCode] = useState('')
    const { status } = useSelector((state) => state.alldiscount)
    // const [disabled, setDisabled] = useState(true)

    const fetchDiscount = useCallback(async () => {
        const { data } = await axios.get(`/Discounts/${params.id}`)
        setDiscount(data.discount)
        setCountForDnt(data.count_for_dnt)
        setPromoCode(data.promo_code)
    }, [params.id])

    const submitHandler = () => {
        try {
            const updatedDiscount= { 'discount': discount, 'count_for_dnt': count_for_dnt, 'promo_code':promo_code,  'id': params.id }
            console.log(updatedDiscount)
            dispatch(updateDiscount(updatedDiscount))
            setDiscount('')
            setCountForDnt('')
            setPromoCode('')
            // navigate('/alldisсount')
        } catch (error) {
            console.log(error)
        }
    }

    // const clearFormHandler = () => {
    //     setDiscount('')
    //     setCountForDnt('')
    //     setPromoCode('')
    // }

    useEffect(() => {
        fetchDiscount();
        if (status) toast(status);
    }, [
        // fetchDiscount,
        status]);


    return (
        <div>
            <form
                className='xl:w-96 w-80 h-96 mx-auto mt-24 border-2 border-green-500 xl:pt-4 pt-12 rounded-lg '
                onSubmit={(e) => e.preventDefault()}>
                <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>Изменение скидки</h1>

                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                    Скидка:
                    <input
                        type='text'
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder='Введите скидку'
                        className='flex mt-1 text-lime-400 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-cyan-950 py-1 px-2 outline-none placeholder:text-almost-white placeholder:text-xl focus:border-emerald-700 focus:bg-transparent focus:text-cyan-950 focus:placeholder:text-cyan-950' />
                </label>

                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                    Баллы:
                    <input
                        type='number'
                        value={count_for_dnt}
                        onChange={(e) => setCountForDnt(e.target.value)}
                        placeholder='Введите баллы необходимы для начисления скидки'
                        className='flex mt-1 text-lime-400 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-cyan-950 py-1 px-2 outline-none placeholder:text-almost-white placeholder:text-xl focus:border-emerald-700 focus:bg-transparent focus:text-cyan-950 focus:placeholder:text-cyan-950' />
                </label>

                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                    Промокод:
                    <input
                        type='text'
                        value={promo_code}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder='Введите промокод...'
                        className='flex mt-1 text-lime-400 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-cyan-950 py-1 px-2 outline-none placeholder:text-almost-white placeholder:text-xl focus:border-emerald-700 focus:bg-transparent focus:text-cyan-950 focus:placeholder:text-cyan-950' />
                </label>

                <div className='flex gap-8 items-center justify-center mt-4'>

                        {(promo_code && count_for_dnt && discount)
                        ?
                            <button
                                type={'button'}
                                onClick={submitHandler}
                                className={`text-medium-gray px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg `}
                            >
                                Изменить
                            </button>
                            :
                            <></>
                    }




                    <Link
                        to='/alldisсount'>
                        <button
                            type={'button'}
                            // onClick={clearFormHandler}
                            className='bg-pink-950 text-medium-gray px-2 py-1 xl:px-5 xl:py-2 text-white rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-pink-950'>
                            Отменить
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
