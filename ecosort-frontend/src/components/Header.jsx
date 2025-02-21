import React, {useState} from 'react';
import {ReactComponent as LogoIcon} from '../image/WasteWiseLogo.svg';
import {ReactComponent as MenuIcon} from '../image/icon-menu.svg';
import {ReactComponent as CloseMenuIcon} from '../image/icon-close-menu.svg';
import {NavItem} from "./NavItam";
import {NavMenu} from "./NavMenu";
import {ARTICLES, ARTICLESUser, DISCOUNTS, DISCOUNTSAdmin, MARKS, MARKSAdmin, POINTSAdmin} from "./constants";
import {Button} from "./Button";
import {MobileMenu} from "./MobileMenu";
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../redux/features/auth/authSlice";
import {toast} from "react-toastify";


export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const logoutHandler = () => {
        dispatch(logout())
        window.localStorage.removeItem('accessToken')
        toast('Вы вышли из системы')
    }

    return(
        <header className={'flex'}>
            <Link to={'/'}>
                <LogoIcon className={'flex items-center'} style={{ width: '52px', height: '52px' }} />
            </Link>

            <nav className={'hidden xl:flex space-x-6 ml-8 items-center'}>

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

                {user?.role === "user" &&  (
                 <Link to={'/reception'}> <NavItem text={'Прием вторсырья'}/> </Link>
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

            {user && (
            <div className={'xl:flex ml-auto space-x-5 mt-3 text-xl text-cyan-950 opacity-90'}>
                {user.username}
            </div>
            )}

            {user ? (
                <div className={'hidden xl:flex ml-auto space-x-5 mt-1'}>
                    <Link to={'/login'}> <button className={'text-medium-gray px-5 py-2 border-2 border-almost-black rounded-lg'}
                                                 onClick={logoutHandler}>Выйти</button></Link>
                </div>
            ): (
                <div className={'hidden xl:flex ml-auto space-x-5 mt-1'}>
                    <Link to={'/login'}><Button>Войти</Button></Link>
                    <Link to={'/register'}><Button hasBorder={true}>Регистрация</Button></Link>
                </div>
            )}


            <div className={'flex xl:hidden ml-auto cursor-pointer z-30'}
                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                { isMobileMenuOpen ? <CloseMenuIcon/> :  <MenuIcon/>}
            </div>
            <MobileMenu isOpen={isMobileMenuOpen}/>
        </header>
    )
}