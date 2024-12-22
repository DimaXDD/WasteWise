import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AiFillDelete, AiTwotoneEdit, AiOutlineBarcode} from "react-icons/ai";
import { toast } from "react-toastify";
import {removePoint} from "../redux/features/point/pointSlice";
import {Link} from "react-router-dom";
import {BiKey} from "react-icons/bi";

export const PointItem = ({point}) => {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const removePointHandler = () => {
        try {
            dispatch(removePoint(point.id))
            // toast('Пункт сдачи отходов был удален')
            // window.location.reload();
            // navigate('/')
        } catch (e) {
            console.log(e)
            // toast('Пункт сдачи отходов не был удален')
        }
    }

    if(!point){
        return(
            <div className={'text-xl text-center text-white py-10'}>
                Пунктов приема не существует...
            </div>
        )
    }
    return (
        <div className={'flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-lime-100 xl:ml-10  rounded-lg gap-2 break-words xl:w-72 xl:h-52 xl:py-3 xl:px-3'}>

            <div className={'flex items-center justify-center text-cyan-950 xl:text-xl font-bold opacity-70 mt-5 xl:mt-0 text-sm overflow '}>
                {point.point_name}
            </div>
            <Link to={point.link_to_map}>
                <div className={'flex items-center justify-center text-center text-lime-700 xl:text-2xl font-bold opacity-100 mt-5 xl:mt-0 text-sm overflow hover:underline hover:text-emerald-700'}>
                        {point.address}
                </div>
            </Link>
            <div className={'flex items-center justify-center text-center text-cyan-950 opacity-95 font-light xl:text-2xl xl:pl-2 text-xs overflow '}>
            {point.time_of_work}
            </div>
            {user?.role === "admin" && (
                <div className={'flex flex-wrap items-end mt-4 xl:mt-0 gap-3  xl:text-2xl text-xl'}>
                    <button className={'flex items-center justify-center gap-2 text-lime-950 opacity-60 hover:text-red-800 hover:opacity-100'}>
                        <Link to={`/${point.id}/editpoint`}>
                            <AiTwotoneEdit />
                        </Link>
                    </button>
                    <button className={'flex items-center justify-center gap-2 text-lime-950 opacity-60 hover:text-red-800 hover:opacity-100'}>
                        <Link to={`/${point.id}/editpointk`}>
                            <BiKey/>
                        </Link>
                    </button>
                    <button
                        onClick={removePointHandler}
                        className={'flex items-center justify-center gap-2 text-lime-950 opacity-60 hover:text-red-800 hover:opacity-100'}>
                        <AiFillDelete />
                    </button>
                </div>
            )}
        </div>
    )
}

