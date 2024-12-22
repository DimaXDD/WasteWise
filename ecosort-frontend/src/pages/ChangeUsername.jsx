import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {changeUsername} from "../redux/features/user/userSlice";

export const ChangeUsername = () => {
    const [username, setUsername] = useState('')
    const [newun, setNewun] = useState('')
    const [rep_newun, setRepNewun] = useState('')
    const [password, setPassword] = useState('')

    const { status } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    // const navigate = useNavigate()

    useEffect(() => {
        if (status) toast(status)
    }, [status])

    // const handleSubmit = () => {
    //     try {
    //         dispatch(loginUser({ email, password }))
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newun===rep_newun) {
                const updatedUsername= { 'username': username, 'newun': newun, 'password':password}


                const response = await dispatch(changeUsername(updatedUsername));

                if (response.payload && response.payload.length > 0) {
                    const validationErrors = response.payload.map((error) => error.msg);
                    toast.error(validationErrors.join(', '));
                }
            }
            else {
                toast.error('Новое имя пользователя не совпадаю')
            }
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            // className='xl:w-96 w-80 h-96 mx-auto mt-20 border-2 border-green-500 xl:pt-1 pt-16 rounded-lg '>
            className='flex flex-col mx-auto xl:w-96 pt-5 pb-5 w-80 mt-16 border-2 border-green-500  rounded-lg '>
            <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>Изменнеие username</h1>
            <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                Имя пользователя
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Введите имя пользователя...'
                    className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-sm xl:placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                />
            </label>

            <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                Новое имя пользователя
                <input
                    type='text'
                    value={newun}
                    onChange={(e) => setNewun(e.target.value)}
                    placeholder='Введите новое имя пользователя...'
                    className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-sm xl:placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                />
            </label>

            <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                Повторите имя пользователя
                <input
                    type='text'
                    value={rep_newun}
                    onChange={(e) => setRepNewun(e.target.value)}
                    placeholder='Повторите имя пользователя...'
                    className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-sm xl:placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                />
            </label>

            <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                Пароль
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Введите пароль...'
                    className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-sm xl:placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                />
            </label>

            <div className='flex gap-8 justify-center mt-4'>
                {( username && newun && rep_newun && password)
                    ?
                    <button
                        type='submit'
                        onClick={handleSubmit}
                        className={`text-white bg-cyan-950 px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg hover:bg-transparent hover:text-almost-black border-2 border-cyan-950 `}
                    >
                        Изменить
                    </button>
                    : <></>
                }
            </div>

        </form>
    )
}
