import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMark, clearStatus } from '../redux/features/mark/markSlice';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { addWeight, clearStatusWeight } from '../redux/features/weight/weightSlice';
import { useNavigate } from 'react-router-dom';

export const AddMarksPage = () => {
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

    const [isEditing, setIsEditing] = useState(false);
    const [currentData, setCurrentData] = useState({
        id: '',
        rubbish_w: '',
        weight: '',
        key_of_weight: '',
    });

    const handleEditClick = (item) => {
        setCurrentData({
            id: item.id,
            rubbish_w: item.Mark?.rubbish || '',
            weight: item.weight,
            key_of_weight: item.original_key,
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
                headers: { 'Content-Type': 'application/json' },
            });

            alert(response.data.message);
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('Не удалось обновить запись');
        }
    };

    useEffect(() => {
        if (status) {
            toast(status); // Показываем уведомление
            dispatch(clearStatus()); // Сбрасываем статус
        }
        if (status_weight) {
            toast(status_weight); // Показываем уведомление
            dispatch(clearStatusWeight()); // Сбрасываем статус
        }
        fetchWeightData();
    }, [status, status_weight, dispatch]);

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
            const file = event.target.files[0];
            const base64 = await convertBase64(file);
            const response = await axios.post('/api/upload', { data: base64 });
            setImageLink(response.data.url);
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

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(addMark({ rubbish, points_per_kg, new_from_kg, image_link }));
            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            } else {
                clearFormHandler();
            }
            dispatch(clearStatus()); // Сбрасываем статус
        } catch (error) {
            console.log(error);
        }
    };

    const submitHandlerWeight = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(addWeight({ rubbish_w, weight, key_of_weight }));
            if (response.payload && response.payload.length > 0) {
                const validationErrors = response.payload.map((error) => error.msg);
                toast.error(validationErrors.join(', '));
            }
            dispatch(clearStatusWeight()); // Сбрасываем статус
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
      <div className='w-full max-w-[1200px] px-6'>
        <div className='flex flex-col xl:flex-row justify-between items-start xl:gap-10'>
          <div className='relative flex flex-col items-center justify-center w-full xl:w-1/2'>
            <form
              className='flex flex-col w-full xl:w-96 p-5 bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.05)]'
              onSubmit={(e) => e.preventDefault()}
            >
              <h1 className='text-slate-800 font-bold text-2xl xl:text-3xl text-center'>
                Добавление вторсырья
              </h1>
              <label className='flex flex-col text-slate-700 text-sm xl:text-base items-center mt-4'>
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
                    className='text-red-600 border-2 border-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200'
                    onClick={onClickRemoveImage}
                  >
                    Удалить
                  </button>
                  <img
                    src={image_link}
                    alt='uploaded'
                    className='rounded-lg mt-2 max-w-[200px] object-contain'
                  />
                </div>
              )}
              <label className='flex flex-col mt-3 text-sm xl:text-base text-slate-700'>
                Вторсырье:
                <input
                  type='text'
                  value={rubbish}
                  onChange={(e) => setRubbish(e.target.value)}
                  placeholder='Введите вид отхода'
                  className='flex mt-1 w-full text-slate-800 rounded-lg border border-slate-200 bg-white py-2 px-3 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                />
              </label>
              <label className='flex flex-col mt-3 text-sm xl:text-base text-slate-700'>
                Баллы за 1 кг:
                <input
                  type='text'
                  value={points_per_kg}
                  onChange={(e) => setPointsPerKg(e.target.value)}
                  placeholder='Введите баллы'
                  className='flex mt-1 w-full text-slate-800 rounded-lg border border-slate-200 bg-white py-2 px-3 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                />
              </label>
              <label className='flex flex-col mt-3 text-sm xl:text-base text-slate-700'>
                Новая продукция из 1 кг:
                <input
                  type='text'
                  value={new_from_kg}
                  onChange={(e) => setNewFromKg(e.target.value)}
                  placeholder='Введите вес новой продукции'
                  className='flex mt-1 w-full text-slate-800 rounded-lg border border-slate-200 bg-white py-2 px-3 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                />
              </label>
              <div className='flex items-center justify-center gap-4 mt-5'>
                {new_from_kg && points_per_kg && rubbish ? (
                  <button
                    type='button'
                    onClick={submitHandler}
                    className='px-6 py-2 text-white bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200'
                  >
                    Добавить
                  </button>
                ) : null}
                <button
                  type='button'
                  onClick={clearFormHandler}
                  className='px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200'
                >
                  Отменить
                </button>
              </div>
            </form>
          </div>
          <div className='relative flex flex-col items-center justify-center w-full xl:w-1/2'>
            <form
              className='flex flex-col w-full xl:w-96 p-5 bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.05)]'
              onSubmit={(e) => e.preventDefault()}
            >
              <h1 className='text-slate-800 font-bold text-2xl xl:text-3xl text-center'>
                Добавление проверки веса
              </h1>
              <label className='flex flex-col mt-3 text-sm xl:text-base text-slate-700'>
                Вид отхода:
                <input
                  type='text'
                  value={rubbish_w}
                  onChange={(e) => setRubbishW(e.target.value)}
                  placeholder='Введите вид отхода'
                  className='flex mt-1 w-full text-slate-800 rounded-lg border border-slate-200 bg-white py-2 px-3 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                />
              </label>
              <label className='flex flex-col mt-3 text-sm xl:text-base text-slate-700'>
                Вес:
                <input
                  type='text'
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder='Введите вес'
                  className='flex mt-1 w-full text-slate-800 rounded-lg border border-slate-200 bg-white py-2 px-3 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                />
              </label>
              <label className='flex flex-col mt-3 text-sm xl:text-base text-slate-700'>
                Ключ:
                <input
                  type='text'
                  value={key_of_weight}
                  onChange={(e) => setKeyOfWeight(e.target.value)}
                  placeholder='Введите ключ'
                  className='flex mt-1 w-full text-slate-800 rounded-lg border border-slate-200 bg-white py-2 px-3 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                />
              </label>
              <div className='flex items-center justify-center gap-4 mt-5'>
                {rubbish_w && weight && key_of_weight ? (
                  <button
                    type='button'
                    onClick={submitHandlerWeight}
                    className='px-6 py-2 text-white bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200'
                  >
                    Добавить
                  </button>
                ) : null}
                <button
                  type='button'
                  onClick={clearFormHandlerWeight}
                  className='px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200'
                >
                  Отменить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className='w-full mt-12 flex flex-col items-center'>
        <div className='w-full max-w-[1200px] px-6'>
          <h2 className='text-slate-800 font-bold text-2xl xl:text-3xl text-center mb-6'>
            Данные веса
          </h2>
          <div className='bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='bg-slate-50'>
                  <th className='px-4 py-3 text-left text-sm font-medium text-slate-700'>ID</th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-slate-700'>Вид вторсырья</th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-slate-700'>Вес</th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-slate-700'>Ключ</th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-slate-700'>Действия</th>
                </tr>
              </thead>
              <tbody>
                {weightData && weightData.length > 0 ? (
                  weightData.map((item) => (
                    <tr key={item.id} className='border-t border-slate-100 hover:bg-slate-50'>
                      <td className='px-4 py-3 text-sm text-slate-700'>{item.id}</td>
                      <td className='px-4 py-3 text-sm text-slate-700'>{item.Mark?.rubbish || 'Неизвестно'}</td>
                      <td className='px-4 py-3 text-sm text-slate-700'>{item.weight}</td>
                      <td className='px-4 py-3 text-sm text-slate-700'>{item.original_key}</td>
                      <td className='px-4 py-3'>
                        <button
                          onClick={() => handleEditClick(item)}
                          className='px-4 py-2 text-sm text-emerald-600 border-2 border-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors duration-200'
                        >
                          Редактировать
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='5' className='px-4 py-6 text-center text-slate-500'>
                      Данные отсутствуют
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {isEditing && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4'>
                <h2 className='text-xl font-bold text-slate-800 mb-4'>Редактировать данные</h2>
                <form>
                  <label className='block mb-3'>
                    <span className='text-sm font-medium text-slate-700'>Вид вторсырья:</span>
                    <input
                      type='text'
                      name='rubbish_w'
                      value={currentData.rubbish_w}
                      onChange={handleInputChange}
                      className='mt-1 w-full text-slate-800 rounded-lg border border-slate-200 bg-white py-2 px-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    />
                  </label>
                  <label className='block mb-3'>
                    <span className='text-sm font-medium text-slate-700'>Вес:</span>
                    <input
                      type='number'
                      name='weight'
                      value={currentData.weight}
                      onChange={handleInputChange}
                      className='mt-1 w-full text-slate-800 rounded-lg border border-slate-200 bg-white py-2 px-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    />
                  </label>
                  <label className='block mb-3'>
                    <span className='text-sm font-medium text-slate-700'>Ключ:</span>
                    <input
                      type='text'
                      name='key_of_weight'
                      value={currentData.key_of_weight}
                      onChange={handleInputChange}
                      className='mt-1 w-full text-slate-800 rounded-lg border border-slate-200 bg-white py-2 px-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    />
                  </label>
                  <div className='flex justify-end gap-3 mt-6'>
                    <button
                      type='button'
                      onClick={handleUpdate}
                      className='px-6 py-2 text-white bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200'
                    >
                      Сохранить
                    </button>
                    <button
                      type='button'
                      onClick={() => setIsEditing(false)}
                      className='px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200'
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
