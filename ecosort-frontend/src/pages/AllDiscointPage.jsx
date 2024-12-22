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
            <div className={'text-xl text-center text-white py-10'}>
               Скидок нет
            </div>
        )
    }

    return (
        <div>
            <div className={'flex items-center justify-center text-4xl text-cyan-900'}>
                Все скидки
            </div>
            <div className={'max-w-[1200px] mx-auto py-10 '}>
                <div className={'flex justify-between gap-10'}>
                    <div className={'flex flex-wrap gap-20  '}>
                        {
                            alldiscounts?.map((alldiscount) => (
                                <AllDiscointItem  key={alldiscount.id} alldiscount={alldiscount}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}