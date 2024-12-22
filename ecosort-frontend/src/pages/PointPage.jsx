import React, {useEffect} from 'react'
// import {Link} from "react-router-dom";
import {PointItem} from "../components/PointItem";
import {useDispatch, useSelector} from "react-redux";
import {getPoints} from "../redux/features/point/pointSlice";
import {toast} from "react-toastify";

export const PointPage = () => {
    const dispatch = useDispatch()
    const {points} = useSelector((state) => state.point)
    const { user } = useSelector((state) => state.auth)
    const { status } = useSelector((state) => state.point)
    const { status_sk } = useSelector((state) => state.secretkey)


    useEffect(() => {
        dispatch(getPoints())
        if (status) toast(status)
        if (status_sk) toast(status_sk)
    }, [dispatch, status, status_sk])



    if(!points.length) {
        return(
            <div>
                {user?.role !== "admin" && (
                    <div className={'text-xl text-center text-white py-10'}>
                        Пунктов приема не существует
                    </div>
                )}
            </div>
        )
    }

    return (
        <div>
            <div className={'flex items-center justify-center text-4xl text-cyan-900'}>
                Адреса и время работы всех пунктов приема
            </div>
            <div className={'max-w-[1200px] mx-auto py-10 '}>
                <div className={'flex justify-between gap-10'}>
                    <div className={'flex flex-wrap gap-20 '}>
                        {
                            points?.map((point) => (
                                <PointItem  key={point.id} point={point}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

