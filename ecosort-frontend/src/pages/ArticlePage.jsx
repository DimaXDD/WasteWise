import React, { useCallback, useEffect, useState } from 'react'
import Moment from "react-moment";
import { AiFillLike, AiOutlineMessage, AiTwotoneEdit, AiFillDelete } from "react-icons/ai";
import axios from "../utils/axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {removeArticles, Likes} from "../redux/features/articles/articleSlice";
import { toast } from "react-toastify";
import { createComment, getComment } from "../redux/features/comment/commentSlice";
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

  //Удаление статьи
  const removeArticleHandler = () => {
    try {
      dispatch(removeArticles(params.id))
      toast('Статья была удалена')
      navigate('/articles')
      window.location.reload();
    } catch (e) {
      console.log(e)
    }
  }

  //Отправка комментария
  const handleSubmit = () => {
    try {
      const article_id = params.id
      dispatch(createComment({ article_id, comment }))
      setComment('')
      // toast('Комментарий успешно добавлен')
      // window.location.reload();
    } catch (e) {
      console.log(e)
    }
  }

  const clearComment = () =>{
    setComment('')
  }

  // Получение комментариев
  const fetchComments = useCallback(async () => {
    try {
      dispatch(getComment(params.id))
    } catch (e) {
      console.log(e)
    }
  }, [params.id, dispatch])

  // Получение статьи
  const fetchArticle = useCallback(async () => {
    const { data } = await axios.get(`/Articles/${params.id}`)
    setArticles(data)
  }, [params.id])

  const onClickLike = () => {
    if (!user) {
      toast('Авторизируйтесь для оценки статьи')
    } else {
        dispatch(Likes(params.id));
        // window.location.reload();
    }
  };

  useEffect(() => {
    fetchComments()
    fetchArticle()
    if (status) toast(status)
    if (status_com)toast(status_com)
  }, [status, status_com, fetchArticle, fetchArticle])

  // useEffect(() => {
  //   fetchArticle()
  // }, [fetchArticle])
  //
  // useEffect(() => {
  //   fetchComments()
  // }, [fetchComments])

  if (!articles) {
    return (
        <div>
          <button className={'flex justify-center items-center bg-cyan-950 border-cyan-950 text-xs text-white rounded-sm py-2 px-4 ml-20 mt-1'}>
            <Link className={'flex'} to={'/'}>Назад</Link>
          </button>

          <div className={'text-xl text-center text-white py-10'}>
            Загрузка...
          </div>
        </div>
    )
  }

  return (
    <div >
      <div className={'flex flex-col max-w-[1200px] mx-auto py-10 '}>
        <div className={'flex flex-col gap-10 py-8 px-12'}>
          <div className={'mx-auto w-full h-full bg-green-100 rounded-lg'}>

            {/*КАРТИНКА*/}
<div className={'flex flex-col basis-1/4 flex-grow'}>
  <div className={articles.image_url ? 'flex rounded-sm h-full' : 'flex rounded-sm'}>
    {articles.image_url && (
      <img 
        src={`http://localhost:8082${articles.image_url}`} 
        className={'object-cover w-full max-w-[400px] max-h-[400px] mx-auto rounded-lg'} 
      />
    )}
  </div>
</div>


            <div className={'flex mx-9 justify-between items-center pt-2'}>
              {/*ПОЛЬЗОВАТЕЛЬ*/}
              <div className={'text-2xl text-lime-900 opacity-50'}>{articles.User.username}</div>
              {/*ДАТА СОЗДАНИЯ*/}
              <div className={'text-xl text-lime-900 opacity-50'}>
                <Moment date={articles.date_of_pub} format={'D MMM YYYY'} />
              </div>
            </div>

            {/*НАЗВАНИЕ*/}
            <div className={'text-lime-600 ml-3 opacity-70 text-5xl font-bold'}>{articles.title}</div>

            {/*ТЕКСТ*/}
            {/*<p className={'text-white opacity-60 text-xs pt-4'}>{articles.text}</p>*/}

            <div className={'text-lime-900 mx-2 mt-5 text-2xl'}>
              <ReactMarkdown children={articles.text} />
            </div>

            <div className={'flex gap-3 items-center mt-2 ml-auto mr-5 mb-1'}>
              <div className={'flex gap-3 mt-4'}>

                {/*КНОПКА ЛАЙКОВ*/}
                <button
                    className={'flex ml-5 items-center justify-center gap-2 text-xl text-lime-900 opacity-50'}
                    onClick={onClickLike}>
                  <AiFillLike /> <span>{articles.likes}</span>
                </button>

                {/*СКОЛЬКО КОММЕНТОВ*/}
                <button className={'flex ml-2 items-center justify-center gap-2 text-xl text-lime-900 opacity-50'}>
                  <AiOutlineMessage /> <span>{comments?.length || 0}</span>
                </button>
              </div>

              {/*КНОПКИ УДАЛЕНИЯ И ИЗМЕНЕНИЯ*/}
              {(user?.id === articles.User.id || user?.role === "admin") && (
                <div className={'flex gap-3 mt-4'}>
                  <button className={'flex items-center justify-center gap-2 text-xl text-lime-900 opacity-50'}>
                  <Link to={`/${params.id}/edit`}>
                    <AiTwotoneEdit />
                  </Link>
                  </button>
                </div>
              )}


              {user?.id === articles.User.id || user?.role === "admin" ? (
                <div className={'flex gap-3 mt-4'}>
                  <button
                    onClick={removeArticleHandler}
                    className={'flex items-center justify-center gap-2 text-xl text-lime-900 opacity-50'}>
                    <AiFillDelete />
                  </button>
                </div>
              ) : null
              }
            </div>
          </div>

          {user && (
          <div className={'flex flex-col bg-green-100 border-t-4 border-lime-900'}>
            <h2 className={'text-lime-900 text-xl font-bold ml-3 my-4'}>Добавить комментарий</h2>
            <SimpleMDE
                // className={styles.editor}
                value={comment} onChange={onChange}
                options={options} />
            <div className={'flex mr-3'}>
              <button className={' my-4 ml-10 text-medium-gray px-5 py-2 text-white bg-black rounded-lg font-bold  mx-0 hover:bg-transparent hover:text-almost-black border-2 border-almost-black'}
                      onClick={handleSubmit}
                      size="large"
                      variant="contained">
                Сохранить </button>
              {/*<a href="/">*/}
                <button className={'my-4 ml-10 text-medium-gray px-5 py-2'}
                        onClick={clearComment}
                        size="large">Отмена</button>
              {/*</a>*/}
            </div>
          </div>
          )}

          <div className={'flex flex-col border-t-4 border-lime-900'}>
            <h2 className={'text-lime-900 text-xl font-bold ml-3 my-4'}>Комментарии</h2>
            {comments?.map((cmt) => (
                  <CommentItem key={cmt.id} cmt={cmt} />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}