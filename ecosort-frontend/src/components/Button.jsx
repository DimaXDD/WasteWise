import React from 'react';

const borderStyles = 'border-2 border-cyan-950 rounded-lg';
const filledStyles = 'text-white bg-cyan-950 rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-cyan-950';

export const Button = ({
    children = '',
    hasBorder = false,
    isFilled = false,
}) => {
    return (
        <button className={`text-medium-gray px-5 py-2 
                            ${hasBorder && borderStyles}
                            ${isFilled && filledStyles}
        `}>
            {children}
        </button>
    )
}