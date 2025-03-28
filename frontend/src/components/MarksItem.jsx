import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {AiFillDelete, AiTwotoneEdit} from "react-icons/ai";
import {removeMark} from "../redux/features/mark/markSlice";
import {Link} from "react-router-dom";

export const MarksItem = ({mark}) => {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const removeMarkHandler = () => {
        try {
            dispatch(removeMark(mark.id))
            toast('Отходы были удалены')
        } catch (e) {
            console.log(e)
            toast('Отход не были удалены')
        }
    }

    if(!mark){
        return(
            <div className="text-xl text-center text-slate-700 py-10">
                Отходов не существует...
            </div>
        )
    }

    return (
        <div className="group flex flex-col w-[300px] bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <Link to={`/${mark.id}/pointsmark`} className="flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                    {mark.image_link && (
                        <img 
                            src={`${mark.image_link}`} 
                            alt={mark.rubbish}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                    )}
                </div>
                <div className="p-3 space-y-1.5">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2">
                        {mark.rubbish}
                    </h3>
                    <div className="space-y-0.5">
                        <p className="text-sm text-slate-600">
                            Баллы за кг: <span className="font-medium text-emerald-600">{mark.points_per_kg}</span>
                        </p>
                        <p className="text-sm text-slate-600">
                            Новая продукция за кг: <span className="font-medium text-emerald-600">{mark.new_from_kg}</span>
                        </p>
                    </div>
                </div>
            </Link>

            {user?.role === "admin" && (
                <div className="flex items-center gap-3 p-3 border-t border-slate-100">
                    <Link 
                        to={`/${mark.id}/editmark`}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 transition-colors duration-200"
                    >
                        <AiTwotoneEdit className="text-lg" />
                        <span className="text-xs font-medium">Редактировать</span>
                    </Link>
                    <button
                        onClick={removeMarkHandler}
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