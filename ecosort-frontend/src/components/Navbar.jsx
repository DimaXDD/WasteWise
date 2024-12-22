import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/features/auth/authSlice'
// import { checkIsAuth } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const Navbar = () => {

    const { user } = useSelector((state) => state.auth)
    // const isAuth = useSelector(checkIsAuth)
    const dispatch = useDispatch()

    const activeStyles = {
        color: 'white',
    }

    const logoutHandler = () => {
        dispatch(logout())
        window.localStorage.removeItem('accessToken')
        toast('Вы вышли из системы')
    }

    return (
        <div className='flex py-4 justify-between items-center '>
            <span className='flex justify-center items-center w-24 h-8 bg-sky-950 text-xs text-white rounded-sm ml-7'>
                <Link to={'/'}>
                    EcoFuture
                </Link>
            </span>
            {/*{setIsAuth && (*/}
            {/*{isAuth && (*/}
            {user && (
                <ul className='flex gap-8'>
                    <li>
                        <NavLink to={'/'} href='/' className='text-sm text-cyan-950 hover:text-white'
                            style={({ isActive }) => isActive ? activeStyles : undefined } >
                            Главная
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/new'} href='/' className='text-sm text-cyan-950 hover:text-white'
                            style={({ isActive }) => isActive ? activeStyles : undefined } >
                            Добавить статью
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/point'} href='/' className='text-sm text-cyan-950 hover:text-white'
                                 style={({ isActive }) => isActive ? activeStyles : undefined } >
                            Точки сбора
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/mydiscount'} href='/' className='text-sm text-cyan-950 hover:text-white'
                                 style={({ isActive }) => isActive ? activeStyles : undefined } >
                            Мои скидки
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/mark'} href='/' className='text-sm text-cyan-950 hover:text-white'
                                 style={({ isActive }) => isActive ? activeStyles : undefined } >
                            Отходы
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/reception'} href='/' className='text-sm text-cyan-950 hover:text-white'
                                 style={({ isActive }) => isActive ? activeStyles : undefined } >
                            Сдача отходы
                        </NavLink>
                    </li>
                    {user?.role === "admin" && (
                    <li>
                        <NavLink to={'/alldisсount'} href='/' className='text-sm text-cyan-950 hover:text-white'
                                 style={({ isActive }) => isActive ? activeStyles : undefined } >
                            Все скидки
                        </NavLink>
                    </li>
                    )}
                </ul>
            )}

            <div className='flex justify-center items-center bg-sky-950 text-xs text-white rounded-sm px-4 py-2 mr-20 mt-1'>
                {user ? (
                    <Link to={'/'}><button onClick={logoutHandler}>Выйти</button></Link>
                ) : (
                    <Link to={'/login'}> Войти </Link>
                )}
            </div>
        </div>
    )
}