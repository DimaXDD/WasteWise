import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import { useParams} from "react-router-dom";
import {getPointsMarks} from "../redux/features/point_mark/point_markSlice";
import {PointMarkItem} from "../components/PointMarkItem";
import axios from "../utils/axios";
import { toast } from 'react-toastify'

export const PointsMarksPage = () => {
    const dispatch = useDispatch()
    const {points_marks} = useSelector((state) => state.point_mark)
    const [rubbish, setRubbish] = useState('')
    const params = useParams()
    const { status } = useSelector((state) => state.point_mark)

    const fetchMark = useCallback(async () => {
        const { data } = await axios.get(`/Marks/${params.id}`)
        setRubbish(data.rubbish)
    }, [params.id])

    useEffect(() => {
        fetchMark()
        if (status) toast(status)
    }, [fetchMark, status])

    useEffect(() => {
        dispatch(getPointsMarks(params.id))
    }, [dispatch])

    return (
        <div className="w-full min-h-[80vh] bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-slate-800">
                            Адреса и время работы пунктов приема
                        </h1>
                        <p className="text-2xl font-medium text-slate-700">
                            {rubbish}
                        </p>
                    </div>

                    {points_marks?.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                            {points_marks.map((point_mark) => (
                                <div key={point_mark.id} className="w-full sm:w-80 lg:w-72 xl:w-80">
                                    <PointMarkItem point_mark={point_mark}/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full min-h-[60vh] flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <h2 className="text-2xl font-semibold text-slate-800">Пунктов приема не найдено</h2>
                                <p className="text-slate-600">Попробуйте проверить позже</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
