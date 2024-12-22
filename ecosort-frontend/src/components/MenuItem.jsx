import React from 'react';
import { NavLink } from 'react-router-dom'


export const MenuItem = ({text = '', icon, link}) => {
    return(
        <NavLink to={link} href='/'>
            <div className={'flex w-full space-x-4 text-medium-gray'}>
                <span className={'mt-1.5'}>{icon}</span>
                <span className={' hover:text-almost-black cursor-pointer'}>{text}</span>
            </div>
        </NavLink>
    )
}