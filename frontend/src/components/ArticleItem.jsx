import React from "react";
import Moment from "react-moment";
import {Link} from "react-router-dom";
import { AiFillLike} from "react-icons/ai";

export const ArticleItem = ({articles}) => {
    if(!articles){
        return(
            <div className="w-full h-48 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="animate-pulse bg-slate-200 rounded-lg w-32 h-32 mx-auto"></div>
                    <div className="animate-pulse bg-slate-200 rounded-lg w-3/4 h-3 mx-auto"></div>
                    <div className="animate-pulse bg-slate-200 rounded-lg w-1/2 h-3 mx-auto"></div>
                </div>
            </div>
        )
    }

    return (
        <Link to={`/${articles.id}`} className="block group">
            <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full border border-gray-100">
                <div className="relative aspect-[16/10] overflow-hidden">
                    {articles.image_url ? (
                        <img 
                            src={`${articles.image_url}`}
                            alt={articles.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                            <span className="text-slate-400 text-xs">Нет изображения</span>
                        </div>
                    )}
                </div>

                <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-medium truncate">{articles.User.username}</span>
                        <Moment date={articles.date_of_pub} format={'D MMM YYYY'}/>
                    </div>

                    <h2 className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2 leading-tight">
                        {articles.title}
                    </h2>

                    <div className="flex items-center gap-1 text-slate-500">
                        <AiFillLike className="w-3 h-3 text-emerald-500"/>
                        <span className="text-xs font-medium">{articles.likes}</span>
                    </div>
                </div>
            </article>
        </Link>
    )
}