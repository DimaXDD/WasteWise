import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {changePass} from "../redux/features/user/userSlice";

export const ChangePassPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [new_pass, setNewPass] = useState('')
    const [rep_new_pass, setRepNewPass] = useState('')

    const { status } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
            if (new_pass===rep_new_pass) {
                const updatedPass= { 'email': email, 'password': password, 'new_pass':new_pass}


                const response = await dispatch(changePass(updatedPass));

                if (response.payload && response.payload.length > 0) {
                    const validationErrors = response.payload.map((error) => error.msg);
                    toast.error(validationErrors.join(', '));
                }
                setRepNewPass('')
                setNewPass('')
                setPassword('')
                setEmail('')

            }
            else {
                toast.error('Пароли не совпадают')
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
            <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>Изменнеие password</h1>
            <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                Почта
                <input
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Введите почту...'
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

            <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                Новый пароль
                <input
                    type='password'
                    value={new_pass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder='Введите новый пароль...'
                    className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-sm xl:placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                />
            </label>

            <label className='flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center mt-3'>
                Повторите пароль
                <input
                    type='password'
                    value={rep_new_pass}
                    onChange={(e) => setRepNewPass(e.target.value)}
                    placeholder='Введите повторно пароль...'
                    className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-sm xl:placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                />
            </label>

            <div className='flex gap-8 justify-center mt-4'>
                {( email && new_pass && rep_new_pass && password)
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
