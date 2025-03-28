import React from 'react';
import {MenuItem} from "./MenuItem";

export const NavMenu = ({items = []}) => {
    return(
        <div className="flex flex-col py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.05)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1)] transition-all duration-200 absolute top-10 right-0 w-48 space-y-1 z-30">
            {items.map(({text, icon, link}) => <MenuItem key={text} text={text} icon={icon} link={link}/>)}
        </div>
    )
}