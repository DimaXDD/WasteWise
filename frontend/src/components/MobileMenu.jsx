import React from 'react';
import {NavItem} from "./NavItam";
import {MenuItem} from "./MenuItem";
import {ARTICLES, ARTICLESUser, DISCOUNTS, DISCOUNTSAdmin, MARKS, MARKSAdmin, POINTSAdmin} from "./constants";
import {Button} from "./Button";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom'


export const MobileMenu = ({isOpen = false}) => {
    const { user } = useSelector((state) => state.auth)

    return(
        <React.Fragment>
            <div className={`absolute xl:hidden top-0 left-0 right-0 bg-almost-black opacity-50 z-10 min-h-[150vh] ${isOpen ? 'flex' : 'hidden'}`}/>
            <div className={`absolute xl:hidden top-0 right-0 w-1/2 bg-green-bk z-20 justify-center min-h-[150vh] ${isOpen ? 'flex' : 'hidden'}`}>
                <nav className={'my-20 mx-5 space-y-5 text-lg w-full'}>

                    {!user && (
                        <NavItem text={'Статьи'}>
                            <div className={'flex flex-col space-y-5 p-2'}>
                                {ARTICLES.map(({text, icon, link}) => <MenuItem key={text} text={text} icon={icon} link={link}/>)}
                            </div>
                        </NavItem>
                    )}

                    {user && (
                        <NavItem text={'Статьи'}>
                            <div className={'flex flex-col space-y-5 p-2'}>
                                {ARTICLESUser.map(({text, icon, link}) => <MenuItem key={text} text={text} icon={icon} link={link}/>)}
                            </div>
                        </NavItem>
                    )}

                    {user && (
                        <Link to={'/reception'}><NavItem text={'Прием вторсырья'}/></Link>
                    )}

                    {user?.role === "user" && (
                        <NavItem text={'Виды вторсырья'}>
                            <div className={'flex flex-col space-y-5 p-2'}>
                                {MARKS.map(({text, icon, link}) => <MenuItem key={text} text={text} icon={icon} link={link}/>)}
                            </div>
                        </NavItem>
                    )}

                    {user?.role === "admin" && (
                        <NavItem text={'Виды вторсырья'}>
                            <div className={'flex flex-col space-y-5 p-2'}>
                                {MARKSAdmin.map(({text, icon, link}) => <MenuItem key={text} text={text} icon={icon} link={link}/>)}
                            </div>
                        </NavItem>
                    )}
                    {user?.role === "admin" && (
                        <NavItem text={'Виды вторсырья'}>
                            <div className={'flex flex-col space-y-5 p-2'}>
                                {POINTSAdmin.map(({text, icon, link}) => <MenuItem key={text} text={text} icon={icon} link={link}/>)}
                            </div>
                        </NavItem>
                    )}



                    {user?.role === "user" && (
                    <NavItem text={'Скидки'}>
                        <div className={'flex flex-col space-y-5 p-2'}>
                            {DISCOUNTS.map(({text, icon, link}) => <MenuItem key={text} text={text} icon={icon} link={link}/>)}
                        </div>
                    </NavItem>
                    )}

                    {user?.role === "admin" && (
                        <NavItem text={'Скидки'}>
                            <div className={'flex flex-col space-y-5 p-2'}>
                                {DISCOUNTSAdmin.map(({text, icon, link}) => <MenuItem key={text} text={text} icon={icon} link={link}/>)}
                            </div>
                        </NavItem>
                    )}

                    <div className={'flex flex-col space-y-5'}>
                        <Button>Войти</Button>
                        <Button hasBorder={true}>Регистариция</Button>
                    </div>

                </nav>
            </div>
        </React.Fragment>
    )
}