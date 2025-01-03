import React, {useState, useEffect} from 'react'
// import {Link} from "react-router-dom";
import { useNavigate} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux";
import {addMark} from "../redux/features/mark/markSlice";
import axios from "../utils/axios";
import {toast} from "react-toastify";
import { addWeight, clearStatusWeight } from "../redux/features/weight/weightSlice";
import {loginUser} from "../redux/features/auth/authSlice";


export const AddMarksPage = ( ) => {

    const dispatch = useDispatch();

    const [rubbish, setRubbish] = useState('');
    const [points_per_kg, setPointsPerKg] = useState('');
    const [new_from_kg, setNewFromKg] = useState('');
    const [image_link, setImageLink] = useState('');

    const [rubbish_w, setRubbishW] = useState('');
    const [weight, setWeight] = useState('');
    const [key_of_weight, setKeyOfWeight] = useState('');

    const [weightData, setWeightData] = useState([]);

    const { status } = useSelector((state) => state.mark);
    const { status_weight } = useSelector((state) => state.weight);

    // const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [currentData, setCurrentData] = useState({
        id: '',
        rubbish_w: '',
        weight: '',
        key_of_weight: ''
    });

    const handleEditClick = (item) => {
        setCurrentData({
            id: item.id,
            rubbish_w: item.Mark?.rubbish || '',
            weight: item.weight,
            key_of_weight: item.original_key // Оставить пустым, чтобы пользователь заполнил новый ключ
        });
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put('/editWeight', currentData, {
                headers: { 'Content-Type': 'application/json' }
            });

            alert(response.data.message); // Сообщение об успехе
            setIsEditing(false);
            window.location.reload(); // Обновить таблицу
        } catch (err) {
            console.error(err);
            alert('Не удалось обновить запись');
        }
    };


    useEffect(() => {
        if (status) toast(status);
        if (status_weight) toast(status_weight);
        fetchWeightData();
    }, [status, status_weight]);

    const fetchWeightData = async () => {
        try {
            const response = await axios.get('/getWeight');
            setWeightData(response.data.data);
        } catch (error) {
            console.log(error);
            toast('Не удалось получить данные веса');
        }
    };

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const { data } = await axios.post('upload', formData);
            console.log(data);
            setImageLink(data.url);
            toast(`Файл загружен ${image_link}`)

        } catch (e) {
            console.warn(e);
            toast('Ошибка загрузки файла')
        }
    };

    // const submitHandler = async () => {
    //     try {
    //         dispatch(addMark({ rubbish, points_per_kg, new_from_kg, image_link}))
    //         console.log(rubbish);
    //         console.log(points_per_kg);
    //         console.log(new_from_kg);
    //         console.log(image_link);
    //         setRubbish('')
    //         setPointsPerKg('')
    //         setNewFromKg('')
    //         setImageLink('')
    //         // navigate('/mark')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(addMark({ rubbish, points_per_kg, new_from_kg, image_link }));
            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            }
        } catch (error) {
            console.log(error);
        }
    };


    // const submitHandlerWeight = async () => {
    //     try {
    //         dispatch(addWeight({ rubbish_w, weight, key_of_weight}))
    //         console.log(rubbish_w);
    //         console.log(weight);
    //         console.log(key_of_weight);
    //         setRubbishW('')
    //         setWeight('')
    //         setKeyOfWeight('')
    //         // navigate('/mark')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const submitHandlerWeight = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(addWeight({ rubbish_w, weight, key_of_weight }));
            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            }
            dispatch(clearStatusWeight()); // Сброс состояния после добавления веса
        } catch (error) {
            console.log(error);
        }
    };

    const clearFormHandler = () => {
        setRubbish('');
        setPointsPerKg('');
        setNewFromKg('');
        setImageLink('');
    };

    const clearFormHandlerWeight = () => {
        setRubbishW('');
        setWeight('');
        setKeyOfWeight('');
    };

    const onClickRemoveImage = () => {
        setImageLink('');
    };

    return (
        <section className='w-full flex flex-col items-center mt-6'>
            {/* Формы слева и справа */}
            <div className='w-full flex flex-col xl:flex-row justify-between items-start xl:gap-10'>
                {/* Форма добавления вторсырья */}
                <div className='relative flex flex-col items-center justify-center pl-4 xl:pl-20 xl:w-1/2 w-full'>
                    <form
                        className='flex flex-col w-full xl:w-96 p-5 border-2 border-green-500 rounded-lg'
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <h1 className='text-lime-900 font-bold text-2xl xl:text-3xl opacity-80 text-center'>
                            Добавление вторсырья
                        </h1>
                        {/* Форма для добавления вторсырья */}
                        <label className='flex flex-col text-lime-900 text-sm xl:text-xl items-center mt-4'>
                            Прикрепить изображение:
                            <input
                                type='file'
                                className='hidden'
                                onChange={handleChangeFile}
                            />
                        </label>
                        {image_link && (
                            <div className='flex flex-col items-center mt-4'>
                                <button
                                    className='bg-pink-950 text-white w-32 py-1 text-sm rounded-lg hover:bg-transparent hover:text-pink-950 border-2 border-pink-950'
                                    onClick={onClickRemoveImage}
                                >
                                    Удалить
                                </button>
                                <img
                                    src={`http://localhost:8082${image_link}`}
                                    alt='uploaded'
                                    className='rounded-lg mt-2'
                                />
                            </div>
                        )}
                        {/* Дополнительные поля */}
                        <label className='flex flex-col mt-3 text-sm xl:text-xl text-lime-900'>
                            Вторсырье:
                            <input
                                type='text'
                                value={rubbish}
                                onChange={(e) => setRubbish(e.target.value)}
                                placeholder='Введите вид отхода'
                                className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                            />
                        </label>
                        <label className='flex flex-col mt-3 text-sm xl:text-xl text-lime-900'>
                            Баллы за 1 кг:
                            <input
                                type='text'
                                value={points_per_kg}
                                onChange={(e) => setPointsPerKg(e.target.value)}
                                placeholder='Введите баллы'
                                className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                            />
                        </label>
                        <label className='flex flex-col mt-3 text-sm xl:text-xl text-lime-900'>
                            Новая продукция из 1 кг:
                            <input
                                type='text'
                                value={new_from_kg}
                                onChange={(e) => setNewFromKg(e.target.value)}
                                placeholder='Введите вес новой продукции'
                                className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                            />
                        </label>
                        {/* Кнопки */}
                        <div className='flex items-center justify-center gap-4 mt-5'>
                            {new_from_kg && points_per_kg && rubbish ? (
                                <button
                                    type='button'
                                    onClick={submitHandler}
                                    className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400'
                                >
                                    Добавить
                                </button>
                            ) : null}
                            <button
                                type='button'
                                onClick={clearFormHandler}
                                className='bg-pink-950 text-medium-gray px-2 py-1 xl:px-5 xl:py-2 text-white rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-pink-950'
                            >
                                Отменить
                            </button>
                        </div>
                    </form>
                </div>
                {/* Форма добавления проверки веса */}
                <div className='relative flex flex-col items-center justify-center pl-4 xl:pl-20 xl:w-1/2 w-full'>
                    <form
                        className='flex flex-col w-full xl:w-96 p-5 border-2 border-green-500 rounded-lg'
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <h1 className='text-lime-900 font-bold text-2xl xl:text-3xl opacity-80 text-center'>
                            Добавление проверки веса
                        </h1>
                        <label className='flex flex-col mt-3 text-sm xl:text-xl text-lime-900'>
                            Вид отхода:
                            <input
                                type='text'
                                value={rubbish_w}
                                onChange={(e) => setRubbishW(e.target.value)}
                                placeholder='Введите вид отхода'
                                className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                            />
                        </label>
                        <label className='flex flex-col mt-3 text-sm xl:text-xl text-lime-900'>
                            Вес:
                            <input
                                type='text'
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder='Введите вес'
                                className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                            />
                        </label>
                        <label className='flex flex-col mt-3 text-sm xl:text-xl text-lime-900'>
                            Ключ:
                            <input
                                type='text'
                                value={key_of_weight}
                                onChange={(e) => setKeyOfWeight(e.target.value)}
                                placeholder='Введите ключ'
                                className='flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'
                            />
                        </label>
                        <div className='flex items-center justify-center gap-4 mt-5'>
                            {rubbish_w && weight && key_of_weight ? (
                                <button
                                    type='button'
                                    onClick={submitHandlerWeight}
                                    className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400'
                                >
                                    Добавить
                                </button>
                            ) : null}
                            <button
                                type='button'
                                onClick={clearFormHandlerWeight}
                                className='bg-pink-950 text-medium-gray px-2 py-1 xl:px-5 xl:py-2 text-white rounded-lg mx-0 hover:bg-transparent hover:text-almost-black border-2 border-pink-950'
                            >
                                Отменить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
{/* Таблица под формами */}
<div className='w-full mt-12'>
        <h2 className='text-lime-900 font-bold text-2xl xl:text-3xl opacity-80 text-center'>
            Данные веса
        </h2>
        <table className='w-full mt-4 border-collapse border border-gray-300 rounded-lg'>
            <thead>
                <tr className='bg-green-500 text-white'>
                    <th className='border border-gray-300 px-4 py-2 text-center'>ID</th>
                    <th className='border border-gray-300 px-4 py-2 text-center'>Вид вторсырья</th>
                    <th className='border border-gray-300 px-4 py-2 text-center'>Вес</th>
                    <th className='border border-gray-300 px-4 py-2 text-center'>Ключ</th>
                    <th className='border border-gray-300 px-4 py-2 text-center'>Действия</th>
                </tr>
            </thead>
            <tbody>
                {weightData && weightData.length > 0 ? (
                    weightData.map((item) => (
                        <tr key={item.id} className='hover:bg-gray-100'>
                            <td className='border border-gray-300 px-4 py-2 text-center'>{item.id}</td>
                            <td className='border border-gray-300 px-4 py-2 text-center'>{item.Mark?.rubbish || 'Неизвестно'}</td>
                            <td className='border border-gray-300 px-4 py-2 text-center'>{item.weight}</td>
                            <td className='border border-gray-300 px-4 py-2 text-center'>{item.original_key}</td>
                            <td className='border border-gray-300 px-4 py-2 text-center'>
                                <button
                                    onClick={() => handleEditClick(item)}
                                    className='bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-500'
                                >
                                    Редактировать
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan='5' className='text-center py-4'>
                            Данные отсутствуют
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

        {/* Модальное окно для редактирования */}
        {isEditing && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h2 className='text-xl font-bold mb-4'>Редактировать данные</h2>
                    <form>
                        <label className='block mb-2'>
                            Вид вторсырья:
                            <input
                                type='text'
                                name='rubbish_w'
                                value={currentData.rubbish_w}
                                onChange={handleInputChange}
                                className='w-full px-3 py-2 border rounded focus:border-emerald-700 focus:outline-none'
                            />
                        </label>
                        <label className='block mb-2'>
                            Вес:
                            <input
                                type='number'
                                name='weight'
                                value={currentData.weight}
                                onChange={handleInputChange}
                                className='w-full px-3 py-2 border rounded focus:border-emerald-700 focus:outline-none'
                            />
                        </label>
                        <label className='block mb-2'>
                            Ключ:
                            <input
                                type='text'
                                name='key_of_weight'
                                value={currentData.key_of_weight}
                                onChange={handleInputChange}
                                className='w-full px-3 py-2 border rounded focus:border-emerald-700 focus:outline-none'
                            />
                        </label>
                        <div className='flex justify-end mt-4'>
                            <button
                                type='button'
                                onClick={handleUpdate}
                                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400'
                            >
                                Сохранить
                            </button>
                            <button
                                type='button'
                                onClick={() => setIsEditing(false)}
                                className='ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-200'
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
        </section>
    );
    
}