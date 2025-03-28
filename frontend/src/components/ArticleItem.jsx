import React from "react";
import Moment from "react-moment";
import {Link} from "react-router-dom";
import { AiFillLike} from "react-icons/ai";

export const ArticleItem = ({articles}) => {
    if(!articles){
        return(
            <div className="w-full h-64 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="animate-pulse bg-slate-200 rounded-lg w-40 h-40 mx-auto"></div>
                    <div className="animate-pulse bg-slate-200 rounded-lg w-3/4 h-3 mx-auto"></div>
                    <div className="animate-pulse bg-slate-200 rounded-lg w-1/2 h-3 mx-auto"></div>
                </div>
            </div>
        )
    }

    return (
        <Link to={`/${articles.id}`} className="block group">
            <article className="bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.05)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1)] transition-all duration-200 overflow-hidden h-full">
                <div className="relative aspect-[4/3] overflow-hidden">
                    {articles.image_url ? (
                        <img 
                            src={`${articles.image_url}`}
                            alt={articles.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                            <span className="text-slate-400 text-sm">Нет изображения</span>
                        </div>
                    )}
                </div>

                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-medium">{articles.User.username}</span>
                        <Moment date={articles.date_of_pub} format={'D MMM YYYY'}/>
                    </div>

                    <h2 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2">
                        {articles.title}
                    </h2>

                    <div className="flex items-center gap-2 text-slate-500">
                        <AiFillLike className="w-4 h-4 text-emerald-500"/>
                        <span className="text-xs font-medium">{articles.likes}</span>
                    </div>
                </div>
            </article>
        </Link>
    )
}