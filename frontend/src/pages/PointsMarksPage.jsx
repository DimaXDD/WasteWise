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
        <section className="w-full min-h-[80vh] py-8">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center space-y-4 mb-8">
                    <h1 className="text-3xl font-bold text-cyan-900">
                        Адреса и время работы пунктов приема
                    </h1>
                    <h2 className="text-2xl font-medium text-cyan-700">
                        {rubbish}
                    </h2>
                </div>

                {points_marks?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {points_marks.map((point_mark) => (
                            <PointMarkItem key={point_mark.id} point_mark={point_mark}/>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg text-cyan-700">
                            Пунктов приема не найдено
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
