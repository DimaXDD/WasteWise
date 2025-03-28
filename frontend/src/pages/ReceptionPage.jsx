import React, {useEffect, useState} from 'react'
// import {Link} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import {createReception} from "../redux/features/reception/receptionSlice";
import {ReactComponent as Earth} from "../image/earth.svg";
import { toast } from 'react-toastify'


export const ReceptionPage = () => {

    const dispatch = useDispatch()
    const [response, setResponse] = useState();
    // const [weight, setWeight] = useState('')
    // const [type_waste, setType_waste] = useState('')
    const [station_key, setStationKey] = useState('')
    const [key_of_weight, setKeyOfWeight] = useState('')
    // const [disabled, setDisabled] = useState(true)

    const { status } = useSelector((state) => state.reception)


    useEffect(() => {
        // console.log(response);
        if (status) toast(status)
    }, [
        // response,
        status]);

    const submitHandler = async () => {
        try {
            setResponse(await dispatch(createReception({
                // weight, type_waste,
                station_key, key_of_weight  })))
            // console.log(weight);
            // console.log(type_waste);
            console.log(station_key);
            console.log(key_of_weight);
            // setWeight('')
            // setType_waste('')
            setStationKey('')
            setKeyOfWeight('')
        } catch (error) {
            console.error(error)
            toast.error('Ошибка при создании приема')
        }
    }

    // useEffect(() => {
    //     if (station_key.trim() && key_of_weight.trim()) {
    //         setDisabled(false)
    //     } else {
    //         setDisabled(true)
    //     }
    // }, [station_key, key_of_weight])

    const clearFormHandler = () => {
        // setWeight('')
        // setType_waste('')
        setStationKey('')
        setKeyOfWeight('')
    }

    return (
        <section className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8">
            <div className="w-full max-w-[800px] px-6">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-800">Прием отходов</h1>
                        <p className="text-slate-600">Введите ключи для подтверждения приема отходов</p>
                    </div>

                    {response?.payload && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                            {response.payload.o_new_kg && (
                                <p className="text-emerald-700">
                                    {`${response.payload.o_new_kg} кг новой продукции будет произведено`}
                                </p>
                            )}
                            {response.payload.o_new_points && (
                                <p className="text-emerald-700">
                                    {`${response.payload.o_new_points} балл(а/ов) вам начислено`}
                                </p>
                            )}
                            {response.payload.o_new_points_user && (
                                <p className="text-emerald-700">
                                    {`${response.payload.o_new_points_user} ваши баллы`}
                                </p>
                            )}
                        </div>
                    )}

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Секретный ключ пункта сдачи
                            </label>
                            <input
                                type="text"
                                value={station_key}
                                onChange={(e) => setStationKey(e.target.value)}
                                placeholder="Введите секретный ключ..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Секретный ключ для подтверждения веса
                            </label>
                            <input
                                type="text"
                                value={key_of_weight}
                                onChange={(e) => setKeyOfWeight(e.target.value)}
                                placeholder="Введите проверку веса..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={clearFormHandler}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Отменить
                            </button>
                            <button
                                type="button"
                                onClick={submitHandler}
                                disabled={!station_key || !key_of_weight}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                                    station_key && key_of_weight
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Добавить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden xl:block w-1/3 mt-8">
                <Earth className="w-full h-auto" />
            </div>
        </section>
    )
}