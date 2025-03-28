import React, {useCallback, useEffect, useState} from 'react'
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate} from "react-router-dom";

import axios from "../utils/axios";
import {updateMark} from "../redux/features/mark/markSlice";
import { toast } from 'react-toastify'

export const UpdateMarkPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { status } = useSelector((state) => state.mark)
    const [rubbish, setRubbish] = useState('')
    const [points_per_kg, setPointsPerKg] = useState('')
    const [new_from_kg, setNewFromKg] = useState('')
    const [image_link, setImageLink] = useState('')

    const params = useParams()

    const fetchMark = useCallback(async () => {
        try {
            const { data } = await axios.get(`/Marks/${params.id}`)
            setRubbish(data.rubbish)
            setPointsPerKg(data.points_per_kg)
            setNewFromKg(data.new_from_kg)
            setImageLink(data.image_link)
        } catch (error) {
            console.error('Ошибка при загрузке марки:', error)
            toast.error('Ошибка при загрузке марки')
        }
    }, [params.id])

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData()
            const file = event.target.files[0]
            formData.append('image', file)
            const { data } = await axios.post('upload', formData)
            setImageLink(data.url)
            toast.success('Изображение успешно загружено')
        } catch (e) {
            console.error(e)
            toast.error('Ошибка при загрузке изображения')
        }
    }

    const submitHandler = () => {
        try {
            const updatedMark = { 
                'rubbish': rubbish, 
                'points_per_kg': points_per_kg, 
                'id': params.id, 
                'new_from_kg': new_from_kg, 
                'image_link': image_link 
            }
            dispatch(updateMark(updatedMark)).then(() => {
                toast.success('Марка успешно обновлена')
                navigate('/mark')
            })
        } catch (error) {
            console.error(error)
            toast.error('Ошибка при обновлении марки')
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
    }, [status, fetchMark])

    const onClickRemoveImage = () => {
        setImageLink('');
        toast.success('Изображение удалено')
    };

    return (
        <section className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8">
            <div className="w-full max-w-[600px] px-6">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-800">Изменение вторсырья</h1>
                        <p className="text-slate-600">Обновите информацию о виде отходов</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col items-center space-y-2">
                            <label className="w-full text-sm font-medium text-slate-700">
                                Прикрепить изображение:
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleChangeFile}
                                    accept="image/*"
                                />
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-lg hover:border-emerald-500 transition-colors duration-200 cursor-pointer">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-slate-600">
                                            <span className="relative bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2">
                                                Загрузить файл
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {image_link && (
                            <div className="relative">
                                <button
                                    onClick={onClickRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
                                >
                                    Удалить
                                </button>
                                <img 
                                    src={image_link}
                                    alt="Загруженное изображение" 
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Вторсырье:
                                </label>
                                <input
                                    type="text"
                                    value={rubbish}
                                    onChange={(e) => setRubbish(e.target.value)}
                                    placeholder="Введите вид отхода"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Баллы начисляемые за 1 кг:
                                </label>
                                <input
                                    type="text"
                                    value={points_per_kg}
                                    onChange={(e) => setPointsPerKg(e.target.value)}
                                    placeholder="Введите баллы"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Новая продукция из 1 кг:
                                </label>
                                <input
                                    type="text"
                                    value={new_from_kg}
                                    onChange={(e) => setNewFromKg(e.target.value)}
                                    placeholder="Введите вес новой продукции"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link 
                                to="/mark"
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Отменить
                            </Link>
                            {(new_from_kg && points_per_kg && rubbish) && (
                                <button
                                    onClick={submitHandler}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    Изменить
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}