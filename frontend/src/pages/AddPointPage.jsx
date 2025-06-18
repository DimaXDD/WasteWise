import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addPoint, resetStatus } from '../redux/features/point/pointSlice';
import { addSecretKey, resetStatusSk } from '../redux/features/secretkey/secretkeySlice';
import { getMark } from '../redux/features/mark/markSlice';
import { YandexMap } from '../components/YandexMap';
import { getPoints } from '../redux/features/point/pointSlice';

export const AddPointPage = () => {
    const dispatch = useDispatch();
    const { status, points } = useSelector((state) => state.point);
    const { status_sk } = useSelector((state) => state.secretkey);
    const { marks } = useSelector((state) => state.mark);

    // Состояния для формы добавления пункта приема
    const [address, setAddress] = useState('');
    const [timeFrom, setTimeFrom] = useState('');
    const [timeTo, setTimeTo] = useState('');
    const [selectedMarks, setSelectedMarks] = useState([]);
    const [link_to_map, setLinkToMap] = useState('');
    const [point_name, setPointName] = useState('');
    const [showMap, setShowMap] = useState(false);

    // Состояние для формы добавления секретного ключа
    const [secret_key, setSecretKey] = useState('');

    // Обработчик выбора локации на карте
    const handleLocationSelect = (link, coords, address) => {
        setLinkToMap(link);
        if (address) {
            setAddress(address);
            toast.success(`Местоположение выбрано: ${address}`);
        } else {
            toast.success('Местоположение выбрано!');
        }
    };

    // Обработчик выбора/отмены выбора марки
    const handleMarkToggle = (markId) => {
        setSelectedMarks(prev => {
            if (prev.includes(markId)) {
                return prev.filter(id => id !== markId);
            } else {
                return [...prev, markId];
            }
        });
    };

    // Обработчик для добавления пункта приема
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const time_of_work = `${timeFrom}-${timeTo}`;
            
            // Получаем названия выбранных видов вторсырья
            const selectedMarksData = marks.filter(mark => selectedMarks.includes(mark.id));
            const rubbishNames = selectedMarksData.map(mark => mark.rubbish);
            const rubbish = rubbishNames.join(', ');

            const response = await dispatch(addPoint({ 
                address, 
                time_of_work, 
                rubbish, 
                link_to_map, 
                point_name,
                selectedMarks 
            }));

            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            } else {
                clearFormHandler();
                // Обновляем список точек после добавления
                dispatch(getPoints());
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Обработчик для добавления секретного ключа
    const submitHandlerKey = async (e) => {
        e.preventDefault();
    
        // Проверка длины ключа на клиенте
        if (secret_key.length < 6) {
            toast.error('Ключ слишком короткий');
            return;
        }
    
        try {
            const response = await dispatch(addSecretKey({ secret_key }));
    
            if (response.payload && response.payload.message) {
                toast.success(response.payload.message); // Успешное добавление
            } else if (response.error) {
                toast.error(response.error.message || 'Ошибка при добавлении ключа');
            }
        } catch (error) {
            toast.error('Ошибка при добавлении ключа');
        }
    };

    // Сброс формы добавления пункта приема
    const clearFormHandler = () => {
        setAddress('');
        setTimeFrom('');
        setTimeTo('');
        setSelectedMarks([]);
        setLinkToMap('');
        setPointName('');
    };

    // Сброс формы добавления секретного ключа
    const clearFormHandlerKey = () => {
        setSecretKey('');
    };

    useEffect(() => {
        if (status_sk) {
            toast(status_sk); // Показываем уведомление
            dispatch(resetStatusSk()); // Сбрасываем статус сразу после отображения
        }
    }, [status_sk, dispatch]);
    
    useEffect(() => {
        if (status) {
            toast(status); // Показываем уведомление
            dispatch(resetStatus()); // Сбрасываем статус сразу после отображения
        }
    }, [status, dispatch]);

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        dispatch(getMark());
        dispatch(getPoints());
    }, [dispatch]);

    return (
        <section className="w-full flex flex-col items-center justify-center min-h-[80vh] py-8">
            <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    {/* Форма добавления пункта приема */}
                    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-800">Добавление пункта приема</h1>
                            <p className="text-slate-600">Создайте новый пункт приема отходов</p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Имя:
                                        </label>
                                        <input
                                            type="text"
                                            value={point_name}
                                            onChange={(e) => setPointName(e.target.value)}
                                            placeholder="Введите имя пункта приема"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Адрес:
                                        </label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Введите адрес пункта приема"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Виды вторсырья:
                                        </label>
                                        <div className="max-h-48 overflow-y-auto border border-slate-300 rounded-lg p-3 space-y-2">
                                            {marks && marks.length > 0 ? (
                                                marks.map((mark) => (
                                                    <label key={mark.id} className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedMarks.includes(mark.id)}
                                                            onChange={() => handleMarkToggle(mark.id)}
                                                            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                                        />
                                                        <span className="text-sm text-slate-700">
                                                            {mark.rubbish} ({mark.points_per_kg} баллов/кг)
                                                        </span>
                                                    </label>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-500">Загрузка видов вторсырья...</p>
                                            )}
                                        </div>
                                        {selectedMarks.length > 0 && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                Выбрано: {selectedMarks.length} вид(ов)
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Время работы:
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={timeFrom}
                                                onChange={(e) => setTimeFrom(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            />
                                            <span className="text-slate-500">-</span>
                                            <input
                                                type="time"
                                                value={timeTo}
                                                onChange={(e) => setTimeTo(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Ссылка на карту:
                                        </label>
                                        <input
                                            type="text"
                                            value={link_to_map}
                                            onChange={(e) => setLinkToMap(e.target.value)}
                                            placeholder="Ссылка будет сгенерирована автоматически"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400 bg-slate-50"
                                            readOnly
                                        />
                                        <p className="text-xs text-slate-500 mt-1">
                                            Выберите местоположение на карте ниже
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Выбор местоположения
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowMap(!showMap)}
                                            className="text-sm text-emerald-600 hover:text-emerald-700"
                                        >
                                            {showMap ? 'Скрыть существующие точки' : 'Показать существующие точки'}
                                        </button>
                                    </div>
                                    
                                    <YandexMap 
                                        onLocationSelect={handleLocationSelect}
                                        initialLink={link_to_map}
                                        showExistingPoints={showMap}
                                        existingPoints={points || []}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={clearFormHandler}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    Отменить
                                </button>
                                {point_name && address && selectedMarks.length > 0 && timeFrom && timeTo && link_to_map && (
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                    >
                                        Добавить
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Форма добавления секретного ключа */}
                    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-800">Добавление секретного ключа</h1>
                            <p className="text-slate-600">Создайте новый секретный ключ для пункта приема</p>
                        </div>

                        <form onSubmit={submitHandlerKey} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Секретный ключ:
                                    </label>
                                    <input
                                        type="text"
                                        value={secret_key}
                                        onChange={(e) => setSecretKey(e.target.value)}
                                        placeholder="Введите секретный ключ (минимум 6 символов)"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={clearFormHandlerKey}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    Отменить
                                </button>
                                {secret_key && (
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                    >
                                        Добавить
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};