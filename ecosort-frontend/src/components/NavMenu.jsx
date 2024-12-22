import React from 'react';
import {MenuItem} from "./MenuItem";

export const NavMenu = ({items = []}) => {
    return(

        <div className={'flex flex-col px-4 py-2 bg-green-100 drop-shadow rounded-lg absolute top-10 right-0 w-48 space-y-2 z-30'}>
            {items.map(({text, icon, link}) => <MenuItem key={text} text={text} icon={icon} link={link}/>)}
        </div>
    )
}