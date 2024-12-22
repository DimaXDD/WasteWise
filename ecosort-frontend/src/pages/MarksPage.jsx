import React, {useEffect} from 'react'
// import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {MarksItem} from "../components/MarksItem";
import {getMark} from "../redux/features/mark/markSlice";
import {toast} from "react-toastify";


export const MarksPage = () => {
    const dispatch = useDispatch()
    const {marks} = useSelector((state) => state.mark)
    // const { user } = useSelector((state) => state.auth)

    const { status } = useSelector((state) => state.mark)

    useEffect(() => {
        dispatch(getMark())
        if (status) toast(status)
    }, [dispatch, status])

    if(!marks.length) {
        return(
            <div className={'text-xl text-center text-white py-10'}>
                У вас нет скидок
            </div>
        )
    }

    return (
        <div>
            <div className={'max-w-[1200px] ml-24 xl:ml-52 py-20'}>
                <div className={'flex justify-between gap-10'}>
                    <div className={'flex flex-wrap gap-20 '}>
                        {
                            marks?.map((mark, idx) => (
                                <MarksItem  key={idx} mark={mark}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
