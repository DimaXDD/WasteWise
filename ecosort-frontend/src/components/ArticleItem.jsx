import React from "react";
import Moment from "react-moment";
import {Link} from "react-router-dom";
import { AiFillLike} from "react-icons/ai";

export const ArticleItem = ({articles}) => {

    if(!articles){
        return(
            <div className={'text-xl text-center text-white py-10'}>
                Загрузка...
            </div>
        )
    }

    return (
        <Link to={`/${articles.id}`}>
            <div className={'flex flex-col basis-1/4 flex-grow bg-green-100 rounded-lg'}>

                <div className={articles.image_url ? 'flex rounded-sm h-full' : 'flex rounded-sm'}>
                    {articles.image_url && (
                        <img src={`http://localhost:8082${articles.image_url}`} className={'object-cover w-full rounded-lg'}/>
                    )}
                </div>

                <div className={'flex mx-9 justify-between items-center pt-2'}>
                    <div className={'text-2xl text-lime-900 opacity-50'}>{articles.User.username}</div>
                    <div className={'text-xl text-lime-900 opacity-50'}><Moment date={articles.date_of_pub} format={'D MMM YYYY'}/></div>
                </div>

                <div className={'text-lime-600 ml-3 opacity-70 text-5xl font-bold'}>{articles.title}</div>

                <div className={'flex gap-3 items-center mt-2 ml-auto mr-5 mb-1'}>
                    <div className={'flex ml-5 items-center justify-center gap-2 text-xl text-lime-900 opacity-50'}>
                        <AiFillLike/> <span>{articles.likes}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}