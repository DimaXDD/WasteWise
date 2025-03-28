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
        } catch (e) {
            console.log(e)
        }
    }

    if(!point){
        return(
            <div className="text-xl text-center text-slate-700 py-10">
                Пунктов приема не существует...
            </div>
        )
    }

    return (
        <div className="group flex flex-col w-[300px] bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors duration-200">
                    {point.point_name}
                </h3>
                
                <Link 
                    to={point.link_to_map}
                    className="block text-sm text-slate-600 hover:text-emerald-600 transition-colors duration-200"
                >
                    {point.address}
                </Link>

                <p className="text-sm text-slate-600">
                    {point.time_of_work}
                </p>
            </div>

            {user?.role === "admin" && (
                <div className="flex items-center gap-3 p-3 border-t border-slate-100">
                    <Link 
                        to={`/${point.id}/editpoint`}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 transition-colors duration-200"
                    >
                        <AiTwotoneEdit className="text-lg" />
                        <span className="text-xs font-medium">Редактировать</span>
                    </Link>
                    <Link 
                        to={`/${point.id}/editpointk`}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 transition-colors duration-200"
                    >
                        <BiKey className="text-lg" />
                        <span className="text-xs font-medium">Ключ</span>
                    </Link>
                    <button
                        onClick={removePointHandler}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors duration-200"
                    >
                        <AiFillDelete className="text-lg" />
                        <span className="text-xs font-medium">Удалить</span>
                    </button>
                </div>
            )}
        </div>
    )
}

