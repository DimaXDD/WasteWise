import React, {useEffect, useState} from 'react'
// import {Link} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import {createReception} from "../redux/features/reception/receptionSlice";
import {clearStatus} from "../redux/features/reception/receptionSlice";
import { BiRecycle } from "react-icons/bi";
import { toast } from 'react-toastify'

// Кастомный компонент круговой прогресс-бар
const CircleProgress = ({ value, max, label, color }) => {
    const radius = 48;
    const stroke = 10;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const percent = max > 0 ? Math.min(value / max, 1) : 0;
    const strokeDashoffset = circumference - percent * circumference;

    return (
        <div className="flex flex-col items-center">
            <svg height={radius * 2} width={radius * 2}>
                <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}Ц
                />
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="1.2em"
                    fill={color}
                    fontWeight="bold"
                >
                    {value}
                </text>
            </svg>
            <span className="mt-2 text-sm text-slate-700 text-center">{label}</span>
        </div>
    );
};

export const ReceptionPage = () => {

    const dispatch = useDispatch()
    const [response, setResponse] = useState();
    // const [weight, setWeight] = useState('')
    // const [type_waste, setType_waste] = useState('')
    const [station_key, setStationKey] = useState('')
    const [key_of_weight, setKeyOfWeight] = useState('')
    // const [disabled, setDisabled] = useState(true)

    const { status } = useSelector((state) => state.reception)

    // Состояния для анимации прогресса
    const [animatedKg, setAnimatedKg] = useState(0);
    const [animatedPoints, setAnimatedPoints] = useState(0);
    const [animatedUserPoints, setAnimatedUserPoints] = useState(0);

    useEffect(() => {
        // console.log(response);
        if (status) toast(status)
        // Очищаем статус при размонтировании, чтобы не было дублей уведомлений
        return () => {
            dispatch(clearStatus());
        };
    }, [
        // response,
        status]);

    useEffect(() => {
        if (response?.payload) {
            // Анимация для новой продукции
            let startKg = 0;
            let startPoints = 0;
            let startUserPoints = 0;
            const targetKg = Number(response.payload.o_new_kg) || 0;
            const targetPoints = Number(response.payload.o_new_points) || 0;
            const targetUserPoints = Number(response.payload.o_new_points_user) || 0;
            const duration = 1000; // ms
            const steps = 30;
            let step = 0;
            const interval = setInterval(() => {
                step++;
                setAnimatedKg(Math.round((targetKg * step) / steps));
                setAnimatedPoints(Math.round((targetPoints * step) / steps));
                setAnimatedUserPoints(Math.round((targetUserPoints * step) / steps));
                if (step >= steps) {
                    setAnimatedKg(targetKg);
                    setAnimatedPoints(targetPoints);
                    setAnimatedUserPoints(targetUserPoints);
                    clearInterval(interval);
                }
            }, duration / steps);
            return () => clearInterval(interval);
        } else {
            setAnimatedKg(0);
            setAnimatedPoints(0);
            setAnimatedUserPoints(0);
        }
    }, [response]);

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
                        <>
                        <div className="flex flex-row flex-wrap items-center justify-center gap-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6 my-4">
                            {response.payload.o_new_kg && (
                                <CircleProgress
                                    value={animatedKg}
                                    max={Math.max(animatedKg, Number(response.payload.o_new_kg) || 1)}
                                    label="кг новой продукции"
                                    color="#059669"
                                />
                            )}
                            {response.payload.o_new_points && (
                                <CircleProgress
                                    value={animatedPoints}
                                    max={Math.max(animatedPoints, Number(response.payload.o_new_points) || 1)}
                                    label="балл(а/ов) начислено"
                                    color="#2563eb"
                                />
                            )}
                            {response.payload.o_new_points_user && (
                                <CircleProgress
                                    value={animatedUserPoints}
                                    max={Math.max(animatedUserPoints, Number(response.payload.o_new_points_user) || 1)}
                                    label="ваши баллы"
                                    color="#f59e42"
                                />
                            )}
                        </div>
                        <div className="text-center text-lg text-emerald-700 font-semibold mt-2">
                            {response.payload.o_total_kg !== undefined
                                ? `Всего сдано вторсырья: ${response.payload.o_total_kg} кг`
                                : response.payload.o_new_kg !== undefined
                                    ? `Всего сдано вторсырья: ${response.payload.o_new_kg} кг`
                                    : null}
                        </div>
                        </>
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
            <div className="hidden xl:flex w-1/3 mt-8 justify-center items-center">
                <BiRecycle className="text-emerald-500" style={{ width: '160px', height: '160px' }} />
            </div>
        </section>
    )
}