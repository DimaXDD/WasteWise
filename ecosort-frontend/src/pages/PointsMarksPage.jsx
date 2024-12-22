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

    // if(!points.length) {
    //     return(
    //         <div>
    //             {user?.role !== "admin" && (
    //                 <div className={'text-xl text-center text-white py-10'}>
    //                     Пунктов приема не существует
    //                 </div>
    //             )}
    //         </div>
    //     )
    // }

    return (
        <div>
            <div className={'flex items-center justify-center text-4xl text-cyan-900'}>
                Адреса и время работы пунктов приема
            </div>
            <div className={'flex items-center justify-center text-3xl pt-3 text-lime-800 font-bold'}>
                {rubbish}
            </div>
            <div className={'max-w-[1200px] mx-auto py-10 '}>
                <div className={'flex justify-between gap-10'}>
                    <div className={'flex flex-wrap gap-20 '}>
                        {
                            points_marks?.map((point_mark) => (
                                <PointMarkItem  key={point_mark.id} point_mark={point_mark}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
