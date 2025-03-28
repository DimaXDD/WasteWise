import React, {useCallback, useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import SimpleMDE from 'react-simplemde-editor';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import 'easymde/dist/easymde.min.css';
import axios from "../utils/axios";
import {toast} from "react-toastify";
import { updateArticles, clearStatus } from '../redux/features/articles/articleSlice';

export const UpArticlesPage = () => {
    // const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { status } = useSelector((state) => state.articles)
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [image_url, setImage_url] = useState('')
    const [disabled, setDisabled] = useState(true)

    const params = useParams()

    const fetchArticles = useCallback(async () => {
        try {
            const { data } = await axios.get(`/Articles/${params.id}`)
            setTitle(data.title)
            setText(data.text)
            setImage_url(data.image_url)
        } catch (error) {
            console.error('Ошибка при загрузке статьи:', error)
            toast.error('Ошибка при загрузке статьи')
        }
    }, [params.id])

    // const navigate = useNavigate();
    //
    // const [loading,
    //     // isLoading,
    //     setLoading] = React.useState(false);


    const inputFileRef = React.useRef(null);
    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const { data } = await axios.post('upload', formData);
            setImage_url(data.url);
            toast.success('Изображение успешно загружено')
        } catch (e) {
            console.warn(e);
            toast.error('Ошибка при загрузке изображения')
        }
    };

    const onClickRemoveImage = () => {
        setImage_url('');
        toast.success('Изображение удалено')
    };

    const onChange = React.useCallback((value) => {
        setText(value);
    }, []);

    const submitHandler = () => {
        try {
            const updatedArticles = { 
                'title': title, 
                'text': text, 
                'id': params.id, 
                'image_url': image_url 
            }
            dispatch(updateArticles(updatedArticles)).then(() => {
                dispatch(clearStatus());
                toast.success('Статья успешно обновлена')
                navigate(`/${params.id}`)
            });
        } catch (error) {
            console.error(error)
            toast.error('Ошибка при обновлении статьи')
        }
    }

    useEffect(() => {
        if (status) toast(status)
        fetchArticles()
        // if (text.trim() && title.trim()) {
        //     setDisabled(false)
        // } else {
        //     setDisabled(true)
        // }
    }, [status, fetchArticles])

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );

    return (
        <section className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8">
            <div className="w-full max-w-[1200px] px-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-6">
                        {/* Загрузка изображения */}
                        <div className="space-y-4">
                            <button 
                                onClick={() => inputFileRef.current.click()}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Загрузить превью
                            </button>

                            <input 
                                ref={inputFileRef}
                                type="file"
                                onChange={handleChangeFile}
                                className="hidden"
                                accept="image/*"
                            />

                            {image_url && (
                                <div className="relative">
                                    <button
                                        onClick={onClickRemoveImage}
                                        className="absolute top-2 right-2 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Удалить
                                    </button>
                                    <img
                                        className="w-full max-w-2xl h-auto rounded-lg object-cover"
                                        src={image_url}
                                        alt="Превью статьи"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Заголовок */}
                        <div>
                            <input
                                className="w-full px-4 py-2 text-2xl font-bold text-slate-800 border-b border-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-400"
                                type="text"
                                placeholder="Заголовок статьи..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Редактор */}
                        <SimpleMDE
                            value={text}
                            onChange={onChange}
                            options={options}
                        />

                        {/* Кнопки */}
                        <div className="flex items-center justify-end gap-4">
                            <button
                                onClick={() => navigate(`/${params.id}`)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Отмена
                            </button>
                            {text && title && (
                                <button
                                    onClick={submitHandler}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    Сохранить
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
