import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import {updatePoint} from "../redux/features/point/pointSlice";
import axios from "../utils/axios";
import {toast} from "react-toastify";

export const UpdatePointPage = () => {

    const dispatch = useDispatch()
    const [time_of_work, setTimeOfWork] = useState('')
    const { status } = useSelector((state) => state.point)
    const params = useParams()

    const fetchPoint = useCallback(async () => {
        const { data } = await axios.get(`/Points/${params.id}`)
        setTimeOfWork(data.time_of_work)
    }, [params.id])

    const submitHandler = () => {
        try {
            const updatedPoint = { 'time_of_work': time_of_work, 'id': params.id }
            console.log(updatedPoint)
            dispatch(updatePoint(updatedPoint))
            setTimeOfWork('')
        } catch (error) {
            console.log(error)
        }
    }

    const clearFormHandler = () => {
        setTimeOfWork('')
    }

    useEffect(() => {
        fetchPoint()
        if (status) toast(status)
    }, [
        // fetchPoint,
        status])

    return (
        <div>
            <form
                className='xl:w-96 w-80 h-60 mx-auto mt-24 border-2 border-green-500 xl:pt-5 pt-12 rounded-lg '
                onSubmit={(e) => e.preventDefault()}>
                <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>Изменение адреса</h1>
                <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                    Время работы:
                    <input
                        type='text'
                        value={time_of_work}
                        onChange={(e) => setTimeOfWork(e.target.value)}
                        placeholder='Время работы...'
                        className='flex mt-1 text-lime-400 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-cyan-950 py-1 px-2 outline-none placeholder:text-almost-white placeholder:text-xl focus:border-emerald-700 focus:bg-transparent focus:text-cyan-950 focus:placeholder:text-cyan-950' />
                </label>

                <div className='flex gap-8 items-center justify-center mt-4'>
                    {(time_of_work)
                        ?
                        <Link to={'/point'}>
                            <button
                                type={'button'}
                                onClick={submitHandler}
                                className={`text-medium-gray px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg `}
                            >
                                Изменить
                            </button>
                        </Link>
                        :
                        <></>
                    }

                    <Link to={'/point'}>
                        <button
                            type={'button'}
                            onClick={clearFormHandler}
                            className='bg-pink-950 text-medium-gray px-2 py-1 xl:px-5 xl:py-2 text-white rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-pink-950'>
                            Отменить
                        </button>
                    </Link>

                </div>

            </form>
        </div>
    )
}