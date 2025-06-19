import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import SimpleMDE from 'react-simplemde-editor';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'easymde/dist/easymde.min.css';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { createArticles } from '../redux/features/articles/articleSlice';

export const AddArticlesPage = () => {
    const { status } = useSelector((state) => state.articles);
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [image_url, setImage_url] = useState('');

    const navigate = useNavigate();
    const inputFileRef = React.useRef(null);

    const handleChangeFile = async (event) => {
        try {
            const file = event.target.files[0];
            const base64 = await convertBase64(file);
            const response = await axios.post('/api/upload', { data: base64 });
            setImage_url(response.data.url);
            toast(`Файл загружен ${response.data.url}`);
        } catch (e) {
            console.warn(e);
            toast('Ошибка загрузки файла');
        }
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const onClickRemoveImage = () => {
        setImage_url('');
    };

    const onChange = React.useCallback((value) => {
        setText(value);
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(createArticles({ title, text, image_url }));
            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            } else {
                navigate('/articles');
            }
        } catch (error) {
            console.log(error);
            toast.error('Произошла ошибка при добавлении статьи');
        }
    };

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '300px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        []
    );

    return (
        //<Paper className={'mt-5 bg-slate-50 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.05)]'}>
        <Paper className={''}>
            <div className="max-w-[800px] mx-auto px-6 py-8">
                <button
                    className={'text-slate-700 px-5 py-2 border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors duration-200'}
                    onClick={() => inputFileRef.current.click()}
                    variant="outlined"
                    size="large"
                    hasBorder={true}
                >
                    Загрузить превью
                </button>

                <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />

                {image_url && (
                    <>
                        <button
                            className={'ml-4 mb-5 px-5 py-2 text-red-600 border-2 border-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200'}
                            variant="contained"
                            color="error"
                            onClick={onClickRemoveImage}
                        >
                            Удалить
                        </button>
                        <div className="flex justify-center my-6">
                            <img
                                src={image_url}
                                alt="Uploaded Preview"
                                className="max-w-[300px] max-h-[200px] object-contain border-2 border-slate-200 rounded-lg"
                            />
                        </div>
                    </>
                )}

                <input
                    className="w-full text-3xl font-bold text-slate-800 placeholder-slate-400 border-b border-slate-200 focus:outline-none focus:border-emerald-500 py-4 mb-6"
                    type={text}
                    placeholder="Заголовок статьи..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <SimpleMDE
                    className="font-medium text-slate-700"
                    value={text}
                    onChange={onChange}
                    options={options}
                />
                <div className="flex items-center mt-6">
                    {text && title ? (
                        <button
                            className="px-6 py-2 text-white bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200"
                            onClick={submitHandler}
                            size="large"
                            variant="contained"
                        >
                            Сохранить
                        </button>
                    ) : null}

                    <a href="/">
                        <button className="ml-4 px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200" size="large">
                            Отмена
                        </button>
                    </a>
                </div>
            </div>
        </Paper>
    );
};
