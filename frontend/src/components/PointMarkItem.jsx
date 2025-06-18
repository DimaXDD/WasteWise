import React from 'react';
import {Link} from "react-router-dom";
import { HiLocationMarker, HiClock, HiExternalLink } from "react-icons/hi";

export const PointMarkItem = ({point_mark}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 group">
            <div className="p-4 space-y-3">
                {/* Название пункта */}
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2">
                        {point_mark.Point.point_name}
                    </h3>
                </div>

                {/* Адрес */}
                <div className="space-y-1">
                    <div className="flex items-start gap-2">
                        <HiLocationMarker className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 font-medium">Адрес</p>
                            <Link 
                                to={point_mark.Point.link_to_map}
                                className="text-sm text-slate-700 hover:text-emerald-600 transition-colors duration-200 line-clamp-2 group/link"
                            >
                                {point_mark.Point.address}
                                <HiExternalLink className="w-3 h-3 inline ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Время работы */}
                <div className="space-y-1">
                    <div className="flex items-start gap-2">
                        <HiClock className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 font-medium">Время работы</p>
                            <p className="text-sm text-slate-700 line-clamp-2">
                                {point_mark.Point.time_of_work}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}