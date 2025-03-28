import React from 'react';
import { NavLink } from 'react-router-dom'

export const MenuItem = ({text = '', icon, link}) => {
    const handleClick = () => {
        // Сбрасываем активное меню при клике на пункт меню
        if (window.activeMenu) {
            window.activeMenu = null;
            // Находим и закрываем все открытые меню
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                const selected = item.getAttribute('data-selected');
                if (selected) {
                    item.setAttribute('data-selected', '');
                }
            });
        }
    };

    return(
        <NavLink to={link} href='/' onClick={handleClick}>
            <div className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors duration-200">
                <span className="text-slate-400">{icon}</span>
                <span className="font-medium">{text}</span>
            </div>
        </NavLink>
    )
}