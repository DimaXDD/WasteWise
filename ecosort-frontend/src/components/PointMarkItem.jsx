import React from 'react';
import {Link} from "react-router-dom";

export const PointMarkItem = ({point_mark}) => {
    return (
        <div className={'flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-lime-100 xl:ml-10  rounded-lg gap-2 break-words xl:w-72 xl:h-44 xl:py-3 xl:px-3'}>
            <div className={'flex items-center justify-center text-cyan-950 xl:text-xl font-bold opacity-70 mt-5 xl:mt-0 text-sm overflow '}>
                {point_mark.Point.point_name}
            </div>
            <Link to={point_mark.Point.link_to_map}>
                <div className={'flex items-center justify-center text-center text-lime-700 xl:text-2xl font-bold opacity-100 mt-5 xl:mt-0 text-sm overflow hover:underline hover:text-emerald-700'}>
                    {/*<p className={'text-center text-cyan-950 opacity-60'}>Адресс</p>*/}
                    {point_mark.Point.address}
                </div>
            </Link>
            <div className={'flex items-center justify-center text-center text-cyan-950 opacity-95 font-light xl:text-2xl xl:pl-2 text-xs overflow '}>
                {/*<p className={'text-center text-cyan-950 opacity-60'}>Время работы</p>*/}
                {point_mark.Point.time_of_work}
            </div>
        </div>
    )
}