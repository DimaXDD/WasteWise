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

    useEffect(() => {
        if (status) toast(status);
    }, [status]);

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
        <Paper className={'mt-5 bg-green-100'}>
            <button
                className={'text-medium-gray mt-5 ml-10 mb-5 px-5 py-2 border-2 border-almost-black rounded-lg'}
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
                        className={'ml-10 mb-5 bg-red-950 text-medium-gray px-5 py-2 text-white rounded-lg font-bold mx-0 hover:bg-transparent hover:text-red-950 border-2 border-red-950'}
                        variant="contained"
                        color="error"
                        onClick={onClickRemoveImage}
                    >
                        Удалить
                    </button>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '20px 0',
                        }}
                    >
                        <img
                            src={image_url}
                            alt="Uploaded Preview"
                            style={{
                                maxWidth: '300px',
                                maxHeight: '200px',
                                objectFit: 'contain',
                                border: '2px solid #ccc',
                                borderRadius: '10px',
                            }}
                        />
                    </div>
                </>
            )}

            <br />
            <br />

            <input
                className={' px-5 placeholder-stone-400 border-b border-medium-gray focus:outline-none hover:border-b-2 hover:border-medium-gray focus:border-b-2 focus:border-lime-600 w-full text-5xl'}
                type={text}
                placeholder="Заголовок статьи..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <SimpleMDE
                className={'font-bold text-2xl'}
                value={text}
                onChange={onChange}
                options={options}
            />
            <div className={'flex mr-3'}>
                {text && title ? (
                    <button
                        className={`my-4 ml-10 text-medium-gray px-5 py-2 text-white bg-black rounded-lg font-bold  mx-0 hover:bg-transparent hover:text-almost-black border-2 border-almost-black `}
                        onClick={submitHandler}
                        size="large"
                        variant="contained"
                    >
                        Сохранить
                    </button>
                ) : (
                    <></>
                )}

                <a href="/">
                    <button className={'my-4 ml-10 text-red-950 font-bold text-xl px-5 py-2'} size="large">
                        Отмена
                    </button>
                </a>
            </div>
        </Paper>
    );
};
