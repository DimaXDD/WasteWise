import React, {useState} from 'react';
import {ReactComponent as LogoIcon} from '../image/WasteWiseLogo.svg';
import {ReactComponent as MenuIcon} from '../image/icon-menu.svg';
import {ReactComponent as CloseMenuIcon} from '../image/icon-close-menu.svg';
import {NavItem} from "./NavItam";
import {NavMenu} from "./NavMenu";
import {ARTICLES, ARTICLESUser, DISCOUNTS, DISCOUNTSAdmin, MARKS, MARKSAdmin, POINTSAdmin} from "./constants";
import {Button} from "./Button";
import {MobileMenu} from "./MobileMenu";
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../redux/features/auth/authSlice";

export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const logoutHandler = () => {
        dispatch(logout())
        window.localStorage.removeItem('accessToken')
        navigate('/')
    }

    return(
        <header className={'sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100 px-6 xl:px-24 py-4'}>
            <div className="flex items-center justify-between max-w-[1920px] mx-auto">
                <div className="flex items-center space-x-8">
                    <Link to={'/'} className="flex items-center space-x-2">
                        <LogoIcon className={'w-10 h-10 text-emerald-500'} />
                        <span className="text-xl font-bold text-slate-800">Waste<span className="text-emerald-500">Wise</span></span>
                    </Link>

                    <nav className={'hidden xl:flex space-x-8 items-center'}>
                        {!user && (
                            <NavItem text={'Статьи'}>
                                <NavMenu items={ARTICLES}/>
                            </NavItem>
                        )}

                        {user && (
                            <NavItem text={'Статьи'}>
                                <NavMenu items={ARTICLESUser}/>
                            </NavItem>
                        )}

                        {user?.role === "user" && (
                            <Link to={'/reception'}><NavItem text={'Прием вторсырья'}/></Link>
                        )}

                        {user?.role === "user" && (
                            <NavItem text={'Виды вторсырья'}>
                                <NavMenu items={MARKS}/>
                            </NavItem>
                        )}

                        {user?.role === "admin" && (
                            <NavItem text={'Виды вторсырья'}>
                                <NavMenu items={MARKSAdmin}/>
                            </NavItem>
                        )}

                        {user?.role === "admin" && (
                            <NavItem text={'Пункты приема'}>
                                <NavMenu items={POINTSAdmin}/>
                            </NavItem>
                        )}

                        {user?.role === "user" && (
                            <NavItem text={'Скидки'}>
                                <NavMenu items={DISCOUNTS}/>
                            </NavItem>
                        )}

                        {user?.role === "admin" && (
                            <NavItem text={'Скидки'}>
                                <NavMenu items={DISCOUNTSAdmin}/>
                            </NavItem>
                        )}

                        {user?.role === "user" && (
                            <Link to={'/recycle-camera'}>
                                <NavItem text={'AI Tool'} />
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center space-x-6">
                    {user && (
                        <span className={'hidden xl:block text-slate-600 font-medium'}>
                            {user.username}
                        </span>
                    )}

                    {user ? (
                        <div className={'hidden xl:flex items-center'}>
                            <button 
                                className={'text-slate-600 px-6 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors duration-200 text-sm font-medium'}
                                onClick={logoutHandler}
                            >
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <div className={'hidden xl:flex items-center space-x-4'}>
                            <Link to={'/login'}>
                                <Button className="bg-white text-slate-600 px-6 py-2.5 hover:bg-slate-50 transition-colors duration-200 text-sm font-medium">
                                    Войти
                                </Button>
                            </Link>
                            <Link to={'/register'}>
                                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 ease-in-out shadow-[0_0_0_3px_rgba(16,185,129,0.1)] hover:shadow-[0_0_0_3px_rgba(16,185,129,0.2)] text-sm font-medium">
                                    Регистрация
                                </Button>
                            </Link>
                        </div>
                    )}

                    <button 
                        className={'flex xl:hidden items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors duration-200'}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <CloseMenuIcon className="w-6 h-6 text-slate-600"/> : <MenuIcon className="w-6 h-6 text-slate-600"/>}
                    </button>
                </div>
            </div>
            <MobileMenu isOpen={isMobileMenuOpen}/>
        </header>
    )
}