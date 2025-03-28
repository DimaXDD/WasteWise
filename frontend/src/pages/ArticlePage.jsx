import React, { useCallback, useEffect, useState } from 'react'
import Moment from "react-moment";
import { AiFillLike, AiOutlineMessage, AiTwotoneEdit, AiFillDelete } from "react-icons/ai";
import axios from "../utils/axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {removeArticles, Likes, clearStatus} from "../redux/features/articles/articleSlice";
import { toast } from "react-toastify";
import { createComment, getComment, clearStatusCom } from "../redux/features/comment/commentSlice";
import { CommentItem } from "../components/CommentItem";
import ReactMarkdown from "react-markdown";
import SimpleMDE from 'react-simplemde-editor';

export const ArticlePage = () => {
  const [articles, setArticles] = useState(null)
  const [comment, setComment] = useState('')

  const params = useParams()
  const { user } = useSelector((state) => state.auth)
  const { comments } = useSelector((state) => state.comment)
  const { status } = useSelector((state) => state.articles)
  const { status_com } = useSelector((state) => state.comment)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onChange = React.useCallback((value) => {
    setComment(value);
  }, []);

  const options = React.useMemo(
      () => ({
        spellChecker: false,
        maxHeight: '80px',
        autofocus: true,
        placeholder: 'Введите комментарий...',
        status: false,
        autosave: {
          enabled: true,
          delay: 1000,
        },
      }),
      [],
  );

  const removeArticleHandler = () => {
    try {
      dispatch(removeArticles(params.id))
      toast.success('Статья была удалена')
      navigate('/articles')
    } catch (e) {
      console.log(e)
      toast.error('Ошибка при удалении статьи')
    }
  }

  const handleSubmit = () => {
    try {
      const article_id = params.id;
      dispatch(createComment({ article_id, comment })).then(() => {
        dispatch(clearStatusCom());
      });
      setComment('');
    } catch (e) {
      console.log(e);
      toast.error('Ошибка при добавлении комментария');
    }
  };

  const clearComment = () => {
    setComment('')
  }

  const fetchComments = useCallback(async () => {
    try {
      dispatch(getComment(params.id))
    } catch (e) {
      console.log(e)
    }
  }, [params.id, dispatch])

  const fetchArticle = useCallback(async () => {
    const { data } = await axios.get(`/Articles/${params.id}`)
    setArticles(data)
  }, [params.id])

  const onClickLike = () => {
    if (!user) {
      toast.warning('Авторизируйтесь для оценки статьи');
    } else {
      dispatch(Likes(params.id)).then(() => {
        dispatch(clearStatus());
      });
    }
  };

  useEffect(() => {
    fetchComments()
    fetchArticle()
    if (status) toast(status)
    if (status_com) toast(status_com)
  }, [status, status_com, fetchArticle, fetchComments])

  if (!articles) {
    return (
      <section className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8">
        <div className="w-full max-w-[1200px] px-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <Link 
                to="/"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Назад
              </Link>
            </div>
            <div className="text-center text-slate-600 py-10">
              Загрузка...
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8">
      <div className="w-full max-w-[1200px] px-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Изображение */}
          {articles.image_url && (
            <div className="w-full h-[400px] overflow-hidden">
              <img 
                src={`${articles.image_url}`} 
                alt={articles.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Заголовок и метаданные */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{articles.User.username}</span>
                <Moment date={articles.date_of_pub} format="D MMM YYYY" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">{articles.title}</h1>
            </div>

            {/* Содержимое статьи */}
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown>{articles.text}</ReactMarkdown>
            </div>

            {/* Интерактивные элементы */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-6">
                <button
                  onClick={onClickLike}
                  className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors duration-200"
                >
                  <AiFillLike className="text-xl" />
                  <span>{articles.likes}</span>
                </button>
                <div className="flex items-center gap-2 text-slate-600">
                  <AiOutlineMessage className="text-xl" />
                  <span>{comments?.length || 0}</span>
                </div>
              </div>

              {(user?.id === articles.User.id || user?.role === "admin") && (
                <div className="flex items-center gap-4">
                  <Link 
                    to={`/${params.id}/edit`}
                    className="text-slate-600 hover:text-emerald-600 transition-colors duration-200"
                  >
                    <AiTwotoneEdit className="text-xl" />
                  </Link>
                  <button
                    onClick={removeArticleHandler}
                    className="text-slate-600 hover:text-red-600 transition-colors duration-200"
                  >
                    <AiFillDelete className="text-xl" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Форма комментария */}
        {user && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Добавить комментарий</h2>
            <SimpleMDE
              value={comment}
              onChange={onChange}
              options={options}
            />
            <div className="flex items-center justify-end gap-4 mt-4">
              <button
                onClick={clearComment}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Сохранить
              </button>
            </div>
          </div>
        )}

        {/* Секция комментариев */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Комментарии</h2>
          <div className="space-y-4">
            {comments?.map((cmt) => (
              <CommentItem key={cmt.id} cmt={cmt} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}