import React, {useState, useEffect} from 'react'
// import {Link} from "react-router-dom";
import { useNavigate} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux";
import {addMark} from "../redux/features/mark/markSlice";
import axios from "../utils/axios";
import {toast} from "react-toastify";
import {addWeight} from "../redux/features/weight/weightSlice";
import {loginUser} from "../redux/features/auth/authSlice";


export const AddMarksPage = ( ) => {

    const dispatch = useDispatch()

    const [rubbish, setRubbish] = useState('')
    const [points_per_kg, setPointsPerKg] = useState('')
    const [new_from_kg, setNewFromKg] = useState('')
    const [image_link, setImageLink] = useState('')

    const [rubbish_w, setRubbishW] = useState('')
    const [weight, setWeight] = useState('')
    const [key_of_weight, setKeyOfWeight] = useState('')

    const { status } = useSelector((state) => state.mark)
    const { status_weight } = useSelector((state) => state.weight)

    // const navigate = useNavigate();


    useEffect(() => {
        if (status) toast(status)
        if (status_weight) toast(status_weight)
    }, [status, status_weight
        // , rubbish, points_per_kg, new_from_kg, rubbish_w, weight, key_of_weight
    ])

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const { data } = await axios.post('upload', formData);
            console.log(data);
            setImageLink(data.url);
            toast(`Файл загружен ${image_link}`)

        } catch (e) {
            console.warn(e);
            toast('Ошибка загрузки файла')
        }
    };

    // const submitHandler = async () => {
    //     try {
    //         dispatch(addMark({ rubbish, points_per_kg, new_from_kg, image_link}))
    //         console.log(rubbish);
    //         console.log(points_per_kg);
    //         console.log(new_from_kg);
    //         console.log(image_link);
    //         setRubbish('')
    //         setPointsPerKg('')
    //         setNewFromKg('')
    //         setImageLink('')
    //         // navigate('/mark')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(addMark({ rubbish, points_per_kg, new_from_kg, image_link}));

            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            }
        } catch (error) {
            console.log(error);
        }
    };


    // const submitHandlerWeight = async () => {
    //     try {
    //         dispatch(addWeight({ rubbish_w, weight, key_of_weight}))
    //         console.log(rubbish_w);
    //         console.log(weight);
    //         console.log(key_of_weight);
    //         setRubbishW('')
    //         setWeight('')
    //         setKeyOfWeight('')
    //         // navigate('/mark')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const submitHandlerWeight = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(addWeight({ rubbish_w, weight, key_of_weight}));

            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const clearFormHandler = () => {
        setRubbish('')
        setPointsPerKg('')
        setNewFromKg('')
        setImageLink('')
    }

    const clearFormHandlerWeight = () => {
        setRubbishW('')
        setWeight('')
        setKeyOfWeight('')
    }

    const onClickRemoveImage = () => {
        setImageLink('');
    };

    return(
        <section className={'w-full flex-col xl:flex-row flex mt-6 justify-between'}>
            <div className={'relative items-center justify-center pl-20 xl:pl-48 order-1 text-center w-full xl:w-2/4 xl:text-left xl:mt-0 mt-12'}>
                <form
                    className='flex flex-col xl:w-96 pt-5 pb-5 w-80 mt-16 border-2 border-green-500 rounded-lg '
                    onSubmit={(e) => e.preventDefault()}>
                    <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>Добавление вторсырья</h1>
                    <label className='flex flex-col xl:text-xl xl:w-80 w-64 ml-8 text-xs xl:text-2xl text-lime-900 border-2 border-dotted border-cyan-950 rounded-lg items-center justify-center mt-3 cursor-pointer'>
                        Прикрепить изорбажение:
                        <input
                            type='file'
                            className='hidden '
                            onChange={handleChangeFile}
                        />
                    </label>
                    <div className='flex flex-col object-cover py-1'>
                        {image_link && (
                            <>
                            <button
                                className='bg-pink-950 text-medium-gray w-32 ml-24 xl:ml-32 px-2 py-1 xl:px-2 xl:py-2 text-white rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-pink-950'
                                onClick={onClickRemoveImage}>
                                Удалить
                            </button>
                            <img src={`http://localhost:8082${image_link}`} alt={'uploaded'} className={'rounded-lg pt-2'}/>
                            </>
                        )}
                    </div>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center'>
                        Вторсырье:
                        <input
                            type='text'
                            value={rubbish}
                            onChange={(e) => setRubbish(e.target.value)}
                            placeholder='Введите вид отхода'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                    </label>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Баллы начислеемые за 1 кг:
                        <input
                            type='text'
                            value={points_per_kg}
                            onChange={(e) => setPointsPerKg(e.target.value)}
                            placeholder='Введите баллы'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                    </label>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Новая продукция из 1 кг:
                        <input
                            type='text'
                            value={new_from_kg}
                            onChange={(e) => setNewFromKg(e.target.value)}
                            placeholder='Введите вес новой продукции'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                    </label>

                    <div className='flex gap-8 items-center justify-center mt-4'>
                        {(new_from_kg && points_per_kg && rubbish)
                            ?
                            <button
                                type={'button'}
                                onClick={submitHandler}
                                className={`text-medium-gray px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg `}
                            >
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
            <div className={'relative order-2 text-center pl-20 xl:pl-36 w-full xl:w-2/4 xl:text-left xl:mt-0 mt-12'}>
                <form
                    className='flex flex-col xl:w-96 pt-5 pb-5 w-80 mt-16 border-2 border-green-500  rounded-lg '
                    onSubmit={(e) => e.preventDefault()}>

                    <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>Добавление проверки веса</h1>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Вид отхода:
                        <input
                            type='text'
                            value={rubbish_w}
                            onChange={(e) => setRubbishW(e.target.value)}
                            placeholder='Введите вид отхода'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                    </label>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Вес:
                        <input
                            type='text'
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder='Введите вес'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                    </label>

                    <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                        Ключ для проверки:
                        <input
                            type='text'
                            value={key_of_weight}
                            onChange={(e) => setKeyOfWeight(e.target.value)}
                            placeholder='Введите ключ'
                            className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50' />
                    </label>

                    <div className='flex gap-8 items-center justify-center mt-4'>
                        {(key_of_weight && weight && rubbish_w )
                            ?
                            <button
                                type={'button'}
                                onClick={submitHandlerWeight}
                                className={`text-medium-gray px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg `}
                            >
                                Добавить
                            </button>
                            :
                            <></>
                        }

                        <button
                            type={'button'}
                            onClick={clearFormHandlerWeight}
                            className='bg-pink-950 text-medium-gray px-2 py-1 xl:px-5 xl:py-2 text-white rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-pink-950'>
                            Отменить
                        </button>
                    </div>

                </form>

            </div>
        </section>
    )
}