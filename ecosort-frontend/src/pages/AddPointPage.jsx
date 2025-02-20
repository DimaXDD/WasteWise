import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addPoint, resetStatus } from '../redux/features/point/pointSlice';
import { addSecretKey, resetStatusSk } from '../redux/features/secretkey/secretkeySlice';
import { getMark } from '../redux/features/mark/markSlice';

export const AddPointPage = () => {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.point);
    const { status_sk } = useSelector((state) => state.secretkey);

    // Состояния для формы добавления пункта приема
    const [address, setAddress] = useState('');
    const [timeFrom, setTimeFrom] = useState('');
    const [timeTo, setTimeTo] = useState('');
    const [rubbish, setRubbish] = useState('');
    const [link_to_map, setLinkToMap] = useState('');
    const [point_name, setPointName] = useState('');

    // Состояние для формы добавления секретного ключа
    const [secret_key, setSecretKey] = useState('');

    // Обработчик для добавления пункта приема
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const time_of_work = `${timeFrom}-${timeTo}`;
            const response = await dispatch(addPoint({ address, time_of_work, rubbish, link_to_map, point_name }));

            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            } else {
                clearFormHandler();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Обработчик для добавления секретного ключа
    const submitHandlerKey = async (e) => {
        e.preventDefault();
    
        // Проверка длины ключа на клиенте
        if (secret_key.length < 6) {
            toast.error('Ключ слишком короткий');
            return;
        }
    
        try {
            const response = await dispatch(addSecretKey({ secret_key }));
    
            if (response.payload && response.payload.message) {
                toast.success(response.payload.message); // Успешное добавление
            } else if (response.error) {
                toast.error(response.error.message || 'Ошибка при добавлении ключа');
            }
        } catch (error) {
            toast.error('Ошибка при добавлении ключа');
        }
    };

    // Сброс формы добавления пункта приема
    const clearFormHandler = () => {
        setAddress('');
        setTimeFrom('');
        setTimeTo('');
        setRubbish('');
        setLinkToMap('');
        setPointName('');
    };

    // Сброс формы добавления секретного ключа
    const clearFormHandlerKey = () => {
        setSecretKey('');
    };

    useEffect(() => {
        if (status_sk) {
            toast(status_sk); // Показываем уведомление
            dispatch(resetStatusSk()); // Сбрасываем статус сразу после отображения
        }
    }, [status_sk, dispatch]);
    
    useEffect(() => {
        if (status) {
            toast(status); // Показываем уведомление
            dispatch(resetStatus()); // Сбрасываем статус сразу после отображения
        }
    }, [status, dispatch]);

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        dispatch(getMark());
    }, [dispatch]);

    return (
        <section className={'w-full flex-col xl:flex-row flex justify-between'}>
            {/* Форма добавления пункта приема */}
            <div className='relative items-center justify-center pl-20 xl:pl-48 order-1 text-center w-full xl:w-2/4 xl:text-left xl:mt-0 mt-8'>
                <form
                    className='flex flex-col xl:w-96 pt-5 pb-5 w-80 mt-16 border-2 border-green-500 rounded-lg'
                    onSubmit={submitHandler}
                >
                    <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>
                        Добавление пункта приема
                    </h1>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Имя:
                        <input
                            type='text'
                            value={point_name}
                            onChange={(e) => setPointName(e.target.value)}
                            placeholder='Введите имя...'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                        />
                    </label>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Адрес:
                        <input
                            type='text'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder='Введите адрес...'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                        />
                    </label>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Виды вторсырья:
                        <input
                            type='text'
                            value={rubbish}
                            onChange={(e) => setRubbish(e.target.value)}
                            placeholder='Введите вторсырье...'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                        />
                    </label>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Время работы:
                        <div className="flex justify-between mt-1">
                            <input
                                type="time"
                                value={timeFrom}
                                onChange={(e) => setTimeFrom(e.target.value)}
                                className='text-cyan-950 xl:w-36 w-28 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white'
                            />
                            <span className='mx-2'>-</span>
                            <input
                                type="time"
                                value={timeTo}
                                onChange={(e) => setTimeTo(e.target.value)}
                                className='text-cyan-950 xl:w-36 w-28 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white'
                            />
                        </div>
                    </label>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Ссылка на карту:
                        <input
                            type='text'
                            value={link_to_map}
                            onChange={(e) => setLinkToMap(e.target.value)}
                            placeholder='Введите ссылку...'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                        />
                    </label>

                    <div className='flex gap-8 items-center justify-center mt-4'>
                        {point_name && address && rubbish && timeFrom && timeTo && link_to_map ? (
                            <button
                                type="submit"
                                className='text-medium-gray px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg'
                            >
                                Добавить
                            </button>
                        ) : null}
                        <button
                            type="button"
                            onClick={clearFormHandler}
                            className='bg-pink-950 text-medium-gray px-2 py-1 xl:px-5 xl:py-2 text-white rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-pink-950'
                        >
                            Отменить
                        </button>
                    </div>
                </form>
            </div>

            {/* Форма добавления секретного ключа */}
            <div className={'relative order-2 text-center pl-20 xl:pl-36 w-full xl:w-2/4 xl:text-left xl:mt-0 mt-8'}>
                <form
                    className='flex flex-col xl:w-96 pt-5 pb-5 w-80 mt-16 border-2 border-green-500 rounded-lg'
                    onSubmit={(e) => e.preventDefault()}
                >
                    <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>
                        Добавление секретного ключа
                    </h1>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Секретный ключ:
                        <input
                            type='text'
                            value={secret_key}
                            onChange={(e) => setSecretKey(e.target.value)}
                            placeholder='Введите ключ...'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                        />
                    </label>

                    <div className='flex gap-8 items-center justify-center mt-4'>
                        {secret_key && (
                            <button
                                type='button'
                                onClick={submitHandlerKey}
                                className='text-medium-gray px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg'
                            >
                                Добавить
                            </button>
                        )}
                        <button
                            type='button'
                            onClick={clearFormHandlerKey}
                            className='bg-pink-950 text-medium-gray px-2 py-1 xl:px-5 xl:py-2 text-white rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-pink-950'
                        >
                            Отменить
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};