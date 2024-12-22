import React, {useState} from 'react'
import { BsCaretDown, BsCaretUpFill } from "react-icons/bs";

export const NavItem = ({text = '', children}) => {
    const [selected, setSelected] = useState('');

    return (
        <div className={'relative'}>
            <div className={'flex space-x-2 cursor-pointer items-center'}>
                <span className={'text-medium-gray text-xl hover:text-almost-black'}
                      onClick={() => children && setSelected(text !== selected ? text:'')}>
                      {text}
                </span>
                { children && selected !== text && <BsCaretDown className={'text-medium-gray items-center mt-1.5'}/>}
                { children && selected === text && <BsCaretUpFill className={'text-medium-gray items-center mt-1'}/>}
            </div>
            { selected && children }
        </div>
    )
}