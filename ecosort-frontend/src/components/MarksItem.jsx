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
            // window.location.reload();
            // navigate('/')
        } catch (e) {
            console.log(e)
            toast('Отход не были удалены')
        }
    }

    if(!mark){
        return(
            <div className={'text-xl text-center text-white py-10'}>
                Отходов не существует...
            </div>
        )
    }

    return (
        <div className={'flex flex-col w-72 ml-24x xl:ml-0 pb-5 bg-gradient-to-br from-amber-100 to-lime-100 rounded-lg'}>

            <Link to={`/${mark.id}/pointsmark`}>
            <div className={mark.image_link ? 'flex rounded-sm ' : 'flex rounded-sm'}>
                {mark.image_link && (
                    <img src={`http://localhost:8082${mark.image_link}`} className={'object-cover w-full h-56 rounded-lg'}/>
                )}
            </div>
            <div className={'text-cyan-950 font-semibold ml-3 pt-1 opacity-80 text-2xl break-all hover:text-cyan-800 hover:font-bold'}>
                {mark.rubbish}
            </div>
            <div className={'text-xl ml-7 text-cyan-950 opacity-80'}>
                Баллы за кг - {mark.points_per_kg}
            </div>
            <div className={'text-xl ml-7 text-cyan-950 opacity-80'}>
                Новая продукция за кг - {mark.new_from_kg}
            </div>

            </Link>

            {user?.role === "admin" && (
                <div className={'flex flex-wrap gap-3 mt-2 ml-3  xl:text-2xl  text-xl'}>
                    <button className={'flex items-center opacity-50 text-lime-950 opacity-60 hover:text-red-800 hover:opacity-100'}>
                        <Link to={`/${mark.id}/editmark`}>
                            <AiTwotoneEdit />
                        </Link>
                    </button>
                    <button
                        onClick={removeMarkHandler}
                        className={'flex items-center opacity-50 text-lime-950 opacity-60 hover:text-red-800 hover:opacity-100'}>
                        <AiFillDelete />
                    </button>
                </div>
            )}
        </div>
    )
}