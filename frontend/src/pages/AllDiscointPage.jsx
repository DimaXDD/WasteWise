import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {getAllDiscounts} from "../redux/features/alldiscount/alldiscountSlice";
// import {Link} from "react-router-dom";
import {AllDiscointItem} from "../components/AllDiscointItem";
import { toast } from 'react-toastify'


export const AllDiscointPage = () => {
    // const { user } = useSelector((state) => state.auth)
    const { status } = useSelector((state) => state.alldiscount)

    const dispatch = useDispatch()
    const {alldiscounts} = useSelector((state) => state.alldiscount)

    useEffect(() => {
        dispatch(getAllDiscounts())
        if (status) toast(status)
    }, [dispatch, status])

    if(!alldiscounts) {
        return(
            <section className="w-full flex flex-col items-center justify-center min-h-[80vh]">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-800">Скидок нет</h2>
                    <p className="text-slate-600">Попробуйте проверить позже</p>
                </div>
            </section>
        )
    }

    return (
        <section className="w-full flex flex-col items-center mt-6">
            <div className="w-full max-w-[1200px] px-6">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-slate-800">Все скидки</h1>
                        <p className="text-slate-600">Доступные скидки для всех пользователей</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 justify-center">
                        {alldiscounts?.map((alldiscount) => (
                            <AllDiscointItem key={alldiscount.id} alldiscount={alldiscount}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}