import React, {useState, useEffect, useCallback} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {addPoint} from "../redux/features/point/pointSlice";
import {addSecretKey} from "../redux/features/secretkey/secretkeySlice";
import { toast } from 'react-toastify'
import {getMark} from "../redux/features/mark/markSlice";

export const AddPointPage = () => {

    const { status } = useSelector((state) => state.point)
    const { status_sk } = useSelector((state) => state.secretkey)

    const [address, setAddress] = useState('')
    const [time_of_work, setTimeOfWork] = useState('')
    const [rubbish, setRubbish] = useState('')
    const [link_to_map, setLinkToMap] = useState('')
    const [point_name, setPointName] = useState('')

    const [secret_key, setSecretKey] = useState('')

    const dispatch = useDispatch()

    // const submitHandler = async () => {
    //     try {
    //         dispatch(addPoint({ address, time_of_work, rubbish, link_to_map, point_name}))
    //         console.log(address);
    //         console.log(time_of_work);
    //         console.log(rubbish);
    //         console.log(link_to_map);
    //         console.log(point_name);
    //         setAddress('')
    //         setTimeOfWork('')
    //         setRubbish('')
    //         setLinkToMap('')
    //         setPointName('')
    //         // navigate('/point')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(addPoint({ address, time_of_work, rubbish, link_to_map, point_name}));

            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            }
        } catch (error) {
            console.log(error);
        }
    };


    // const submitHandlerKey = async () => {
    //     try {
    //         dispatch(addSecretKey({ secret_key}))
    //         console.log(secret_key);
    //         setSecretKey('')
    //         // navigate('/point')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const submitHandlerKey = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(addSecretKey({ secret_key}));

            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const clearFormHandler = () => {
        setAddress('')
        setTimeOfWork('')
        setRubbish('')
        setLinkToMap('')
        setPointName('')
    }

    const clearFormHandlerKey = () => {
        setSecretKey('')
    }

    useEffect(() => {
        dispatch(getMark())
        if (status) toast(status)

    }, [status, status_sk])

    useEffect(() => {
        dispatch(getMark())
        if (status_sk) toast(status_sk)
    }, [status_sk])

    return (
        <section className={'w-full flex-col xl:flex-row flex  justify-between'}>
            <div className={'relative items-center justify-center pl-20 xl:pl-48 order-1 text-center w-full xl:w-2/4 xl:text-left xl:mt-0 mt-8'}>
                <form
                    className='flex flex-col xl:w-96 pt-5 pb-5 w-80 mt-16 border-2 border-green-500  rounded-lg '
                    onSubmit={(e) => e.preventDefault()}>

                <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>Добавление пункта приема</h1>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Имя:
                        <input
                            type='text'
                            value={point_name}
                            onChange={(e) => setPointName(e.target.value)}
                            placeholder='Введите имя...'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                    </label>

                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                    Адрес:
                    <input
                        type='text'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Введите адресс...'
                        className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                </label>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Виды вторсырья:
                        <input
                            type='text'
                            value={rubbish}
                            onChange={(e) => setRubbish(e.target.value)}
                            placeholder='Введите вторсырье...'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                    </label>

                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                Время работы:
                    <input
                        type='text'
                        value={time_of_work}
                        onChange={(e) => setTimeOfWork(e.target.value)}
                        placeholder='Введите время работы...'
                        className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                </label>

                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                Ссылка на карту:
                    <input
                        type='text'
                        value={link_to_map}
                        onChange={(e) => setLinkToMap(e.target.value)}
                        placeholder='Введите ссылку...'
                        className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                </label>

                <div className='flex gap-8 items-center justify-center mt-4'>
                    {(point_name && address && rubbish && time_of_work && link_to_map)
                        ?
                        <button
                            type={'button'}
                            onClick={submitHandler}
                            className={`text-medium-gray px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg `}>
                            Добавить
                        </button>
                        : <></>
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


            <div className={'relative order-2 text-center pl-20 xl:pl-36 w-full xl:w-2/4 xl:text-left xl:mt-0 mt-8'}>
                <form
                    className='flex flex-col xl:w-96 pt-5 pb-5 w-80 mt-16 border-2 border-green-500  rounded-lg '
                    onSubmit={(e) => e.preventDefault()}>

                    <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>Добавление секретного ключа</h1>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                    Секретный ключ:
                        <input
                            type='text'
                            value={secret_key}
                            onChange={(e) => setSecretKey(e.target.value)}
                            placeholder='Введите ключ...'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                    </label>

                    <div className='flex gap-8 items-center justify-center mt-4'>
                        {(secret_key) ?
                            <button
                                type={'button'}
                                onClick={submitHandlerKey}
                                className={`text-medium-gray px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg`}
                            >
                                Добавить
                            </button>
                            :
                            <></>
                        }

                        <button
                            type={'button'}
                            onClick={clearFormHandlerKey}
                            className='bg-pink-950 text-medium-gray px-2 py-1 xl:px-5 xl:py-2 text-white rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-pink-950'>
                            Отменить
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}