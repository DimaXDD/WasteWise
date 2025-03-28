import React, {useEffect} from 'react'
import {ArticleItem} from "../components/ArticleItem";
import {useDispatch, useSelector} from "react-redux";
import {getArticles} from "../redux/features/articles/articleSlice";
import { toast } from 'react-toastify'

export const AllArticlesPage = () => {
    const dispatch = useDispatch()
    const { status, article = [] } = useSelector((state) => state.articles);

    useEffect(() => {
        dispatch(getArticles());
        if (status) toast(status)
    }, [dispatch, status])

    if(!article.length){
        return(
            <div className="w-full min-h-[80vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-800">Статей не существует</h2>
                    <p className="text-slate-600">Попробуйте проверить позже</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-[80vh] bg-white">
            <div className="max-w-[1200px] mx-auto px-6 xl:px-24 py-12">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-slate-800">Все статьи</h1>
                        <p className="text-slate-600">Изучите наши материалы о переработке отходов</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {article?.map((articles) => (
                            <div key={articles.id} className="w-full">
                                <ArticleItem articles={articles}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}