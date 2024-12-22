import React, {useEffect} from 'react'
import {ArticleItem} from "../components/ArticleItem";
import {useDispatch, useSelector} from "react-redux";
import {getArticles} from "../redux/features/articles/articleSlice";
import { toast } from 'react-toastify'


export const AllArticlesPage = () => {
        const dispatch = useDispatch()
    const { status } = useSelector((state) => state.articles)

    const {article} = useSelector((state) => state.articles)

        useEffect(() => {
            dispatch(getArticles());
            if (status) toast(status)
            // window.location.reload();
        }, [dispatch, status])

        if(!article.length){
            return(
                <div className={'text-xl text-center text-white py-10'}>
                    Статей не существует
                </div>
            )
        }
        return (
            <div className={'max-w-[900px] mx-auto py-10 '}>
                <div className={'flex justify-between gap-8'}>
                    <div className={'flex flex-col gap-10 '}>
                        {article?.map((articles) => (
                            <ArticleItem key={articles.id} articles={articles}/>))}
                    </div>
                </div>
            </div>
        )
    }