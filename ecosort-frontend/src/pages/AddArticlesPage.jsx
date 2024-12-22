import React, {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import SimpleMDE from 'react-simplemde-editor';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate} from "react-router-dom";
import 'easymde/dist/easymde.min.css';
import axios from "../utils/axios";
import {toast} from "react-toastify";
import {createArticles} from "../redux/features/articles/articleSlice";
import {loginUser} from "../redux/features/auth/authSlice";


export const AddArticlesPage = () => {

    // const { user } = useSelector((state) => state.auth)

    const { status } = useSelector((state) => state.articles)

    const dispatch = useDispatch()

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [image_url, setImage_url] = useState('')

    const navigate = useNavigate();
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
            console.log(data);
            setImage_url(data.url);
            toast(`Файл загружен ${image_url}`)

        } catch (e) {
            console.warn(e);
            toast('Ошибка загрузки файла')
        }
    };

    const onClickRemoveImage = () => {
        setImage_url('');
    };

    const onChange = React.useCallback((value) => {
        setText(value);
    }, []);

    // const submitHandler = () => {
    //     try {
    //         dispatch(createArticles({ title, text, image_url }))
    //         console.log(title);
    //         console.log(text);
    //         console.log(image_url);
    //         setText('')
    //         setTitle('')
    //         setImage_url('')
    //         // navigate('/articles')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(createArticles({ title, text, image_url }));

            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (status) toast(status)

    }, [status])

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
        [],
    );


    return (
        <Paper className={'mt-5 bg-green-100'}>

            <button className={'text-medium-gray mt-5 ml-10 mb-5 px-5 py-2 border-2 border-almost-black rounded-lg'}
                    onClick={() => inputFileRef.current.click()}
                    variant="outlined"
                    size="large"
                    hasBorder={true}>
                Загрузить превью
            </button>

            <input  ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />

            {image_url && (
                <>
                    <button className={'ml-10 mb-5 bg-red-950 text-medium-gray px-5 py-2 text-white  rounded-lg font-bold  mx-0 hover:bg-transparent hover:text-red-950 border-2 border-red-950'} variant="contained" color="error" onClick={onClickRemoveImage}>
                        Удалить
                    </button>
                    <img
                        className={'mt-50 w-full'}
                        src={`http://localhost:8082${image_url}`}
                        alt="Uploaded" />
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
                // className={styles.editor}
                value={text} onChange={onChange}
                options={options} />
            <div className={'flex mr-3'}>
                {(text && title)
                    ?
                    <button
                        className={`my-4 ml-10 text-medium-gray px-5 py-2 text-white bg-black rounded-lg font-bold  mx-0 hover:bg-transparent hover:text-almost-black border-2 border-almost-black `}
                        onClick={submitHandler}
                        size="large"
                        variant="contained"
                    >
                        Сохранить </button>
                    :
                    <></>
                }

                <a href="/">
                    <button className={'my-4 ml-10 text-red-950 font-bold text-xl px-5 py-2'}
                        size="large">Отмена</button>
                </a>
            </div>
        </Paper>
    );
};
