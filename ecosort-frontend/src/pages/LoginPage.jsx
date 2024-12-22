import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [validationErrors, setValidationErrors] = useState(null);

    const { status } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        if (status) toast(status)
        if (user) navigate('/')
    }, [status, user, navigate])

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
            const response = await dispatch(loginUser({ email, password }));

            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            }
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className='xl:w-96 w-80 h-96 mx-auto mt-24 border-2 border-green-500 xl:pt-6 pt-20 rounded-lg '>
            <h1 className='text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'>Авторизация</h1>
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

            <div className='flex gap-8 justify-center mt-4'>
                {(email && password)
                    ?
                    <button
                        type='submit'
                        onClick={handleSubmit}
                        className={`text-white bg-cyan-950 px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg hover:bg-transparent hover:text-almost-black border-2 border-cyan-950 `}
                    >
                        Войти
                    </button>
                    : <></>
                }

                <Link
                    to='/register'
                    className='flex justify-center items-center text-sm xl:text-xl text-lime-700'
                >
                    Нет аккаунта ?
                </Link>
            </div>
            <div className='flex gap-8 justify-center mt-4'>
                <Link
                    to='/change/username'>
                <button
                    className={`flex flex-wrap text-white bg-cyan-950 px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg hover:bg-transparent hover:text-almost-black border-2 border-cyan-950  text-sm`}>
                    Изменить username
                </button>
                </Link>
                <Link
                    to='/change/pass'>
                    <button
                        className={`flex flex-wrap text-white bg-cyan-950 px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg hover:bg-transparent hover:text-almost-black border-2 border-cyan-950  text-sm`}>
                        Изменить password
                    </button>
                </Link>
            </div>
        </form>
    )
}
