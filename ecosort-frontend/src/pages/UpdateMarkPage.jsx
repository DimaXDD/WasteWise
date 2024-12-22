import React, {useCallback, useEffect, useState} from 'react'
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate} from "react-router-dom";

import axios from "../utils/axios";
import {updateMark} from "../redux/features/mark/markSlice";
import { toast } from 'react-toastify'


export const UpdateMarkPage = () => {

    const dispatch = useDispatch()
    // const navigate = useNavigate();
    const { status } = useSelector((state) => state.mark)
    const [rubbish, setRubbish] = useState('')
    const [points_per_kg, setPointsPerKg] = useState('')
    const [new_from_kg, setNewFromKg] = useState('')
    const [image_link, setImageLink] = useState('')
    // const [disabled, setDisabled] = useState(true)


    const params = useParams()

    const fetchMark = useCallback(async () => {
        const { data } = await axios.get(`/Marks/${params.id}`)
        setRubbish(data.rubbish)
        setPointsPerKg(data.points_per_kg)
        setNewFromKg(data.new_from_kg)
        setImageLink(data.image_link)
    }, [params.id])

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData()
            const file = event.target.files[0]
            formData.append('image', file)
            const { data } = await axios.post('upload', formData)
            console.log(data)
            setImageLink(data.url)
            console.log(image_link)
            toast(`Файл загружен`)
        } catch (e) {
            console.log(e)
            toast('Ошибка при загрузке изображения')
        }
    }

    // useEffect(() => {
    //     if (rubbish.trim() && typeof points_per_kg === 'string' && typeof new_from_kg === 'string' && new_from_kg.trim()) {
    //         setDisabled(false);
    //     } else {
    //         setDisabled(true);
    //     }
    // }, [rubbish, points_per_kg, new_from_kg]);




    const submitHandler = () => {
        try {
            const updatedMark = { 'rubbish': rubbish, 'points_per_kg': points_per_kg, 'id': params.id, 'new_from_kg': new_from_kg, 'image_link': image_link }
            console.log(updatedMark)
            dispatch(updateMark(updatedMark))
            setRubbish('')
            setPointsPerKg('')
            setNewFromKg('')
            setImageLink('')
            // navigate('/mark')
        } catch (error) {
            console.log(error)
        }
    }

    const clearFormHandler = () => {
        setRubbish('')
        setPointsPerKg('')
        setNewFromKg('')
        setImageLink('')
    }

    useEffect(() => {
        fetchMark()
        if (status) toast(status)
    }, [
        // fetchMark,
        status])

    const onClickRemoveImage = () => {
        setImageLink('');
    };

    return (
        <div>
            <form
                className='xl:w-96 w-80 mx-auto mt-8 border-2 border-green-500 xl:pt-5 pt-12 rounded-lg pb-5'
                onSubmit={(e) => e.preventDefault()}>
                <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>Изменение вторсырья</h1>

                <label className='flex flex-col xl:text-xl xl:w-80 w-64 ml-8 text-xs xl:text-2xl text-lime-900 border-2 border-dotted border-cyan-950 rounded-lg items-center justify-center mt-3 cursor-pointer'>
                Прикрепить изорбажение:
                    <input
                        type='file'
                        className='hidden'
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
                            <img src={`http://localhost:8082${image_link}`} alt={'uploaded'} className={'rounded-lg pt-2 w-full h-72  '}/>
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
                        className='flex mt-1 text-lime-400 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-cyan-950 py-1 px-2 outline-none placeholder:text-almost-white placeholder:text-xl focus:border-emerald-700 focus:bg-transparent focus:text-cyan-950 focus:placeholder:text-cyan-950' />
                </label>

                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center'>
                    Баллы начислеемые за 1 кг:
                    <input
                        type='text'
                        value={points_per_kg}
                        onChange={(e) => setPointsPerKg(e.target.value)}
                        placeholder='Введите баллы'
                        className='flex mt-1 text-lime-400 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-cyan-950 py-1 px-2 outline-none placeholder:text-almost-white placeholder:text-xl focus:border-emerald-700 focus:bg-transparent focus:text-cyan-950 focus:placeholder:text-cyan-950' />
                </label>

                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center'>
                    Новая продукция из 1 кг:
                    <input
                        type='text'
                        value={new_from_kg}
                        onChange={(e) => setNewFromKg(e.target.value)}
                        placeholder='Введите вес новой продукции'
                        className='flex mt-1 text-lime-400 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-cyan-950 py-1 px-2 outline-none placeholder:text-almost-white placeholder:text-xl focus:border-emerald-700 focus:bg-transparent focus:text-cyan-950 focus:placeholder:text-cyan-950' />
                </label>

                <div className='flex gap-8 items-center justify-center mt-4 '>
                    {(new_from_kg && points_per_kg && rubbish)
                        ?
                        <button
                            type={'button'}
                            onClick={submitHandler}
                            className={`text-medium-gray px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg`}
                        >
                            Изменить
                        </button>
                        : <></>
                    }

                    <Link to={'/mark'}>
                    <button
                        type={'button'}
                        onClick={clearFormHandler}
                        className='bg-pink-950 text-medium-gray px-2 py-1 xl:px-5 xl:py-2 text-white rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-pink-950'>
                        Отменить
                    </button>
                        </Link>
                </div>
            </form>
        </div>
    )
}