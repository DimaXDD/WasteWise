import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const initialState = {
    points: [],
    loading: false,
    status: null,
};

// Вспомогательная функция для обработки ошибок
const handleAsyncThunkError = (error) => {
    console.log(error);
    throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
};

// Получение всех точек
export const getPoints = createAsyncThunk(
    'point/getPoints',
    async () => {
        try {
            const { data } = await axios.get('/points');
            return data;
        } catch (error) {
            handleAsyncThunkError(error);
        }
    }
);

// Удаление точки
export const removePoint = createAsyncThunk(
    'point/removePoint',
    async (id) => {
        try {
            const { data } = await axios.delete(`/points/${id}`);
            return data;
        } catch (error) {
            handleAsyncThunkError(error);
        }
    }
);

// Добавление точки
export const addPoint = createAsyncThunk(
    'point/addPoint',
    async ({ address, time_of_work, rubbish, link_to_map, point_name }) => {
        try {
            const { data } = await axios.post('/points', {
                address,
                time_of_work,
                rubbish,
                link_to_map,
                point_name,
            });
            return data;
        } catch (error) {
            handleAsyncThunkError(error);
        }
    }
);

// Обновление точки
export const updatePoint = createAsyncThunk(
    'point/updatePoint',
    async (updatedPoint) => {
        try {
            const { data } = await axios.put(`/points/${updatedPoint.id}`, updatedPoint);
            return data;
        } catch (error) {
            handleAsyncThunkError(error);
        }
    }
);

// Обновление секретного ключа
export const updatePointK = createAsyncThunk(
    'point/updatePointK',
    async (updatedPointK) => {
        try {
            const { data } = await axios.put(`/points/key/${updatedPointK.id}`, updatedPointK);
            return data;
        } catch (error) {
            handleAsyncThunkError(error);
        }
    }
);

export const pointSlice = createSlice({
    name: 'point',
    initialState,
    reducers: {
        // Добавляем reducer для сброса статуса
        resetStatus: (state) => {
            state.status = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Получить точки сбора
            .addCase(getPoints.pending, (state) => {
                state.loading = true;
                state.status = null;
            })
            .addCase(getPoints.fulfilled, (state, action) => {
                state.loading = false;
                state.points = action.payload.points;
            })
            .addCase(getPoints.rejected, (state, action) => {
                state.loading = false;
                state.status = action.error.message;
            })

            // Удаление точки сбора
            .addCase(removePoint.pending, (state) => {
                state.loading = true;
                state.status = null;
            })
            .addCase(removePoint.fulfilled, (state, action) => {
                state.loading = false;
                state.points = state.points.filter(
                    (point) => point.id !== action.payload.id
                );
                state.status = action.payload.message;
            })
            .addCase(removePoint.rejected, (state, action) => {
                state.loading = false;
                state.status = action.error.message;
            })

            // Добавление точки сбора
            .addCase(addPoint.pending, (state) => {
                state.loading = true;
                state.status = null;
            })
            .addCase(addPoint.fulfilled, (state, action) => {
                state.loading = false;
                state.points.push(action.payload);
                state.status = action.payload.message;
            })
            .addCase(addPoint.rejected, (state, action) => {
                state.loading = false;
                state.status = action.error.message;
            })

            // Обновление точки сбора
            .addCase(updatePoint.pending, (state) => {
                state.loading = true;
                state.status = null;
            })
            .addCase(updatePoint.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.points.findIndex((point) => point.id === action.payload.id);
                if (index !== -1) {
                    state.points[index] = action.payload;
                }
                state.status = action.payload.message;
            })
            .addCase(updatePoint.rejected, (state, action) => {
                state.loading = false;
                state.status = action.error.message;
            })

            // Обновление секретного ключа
            .addCase(updatePointK.pending, (state) => {
                state.loading = true;
                state.status = null;
            })
            .addCase(updatePointK.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.points.findIndex((point) => point.id === action.payload.id);
                if (index !== -1) {
                    state.points[index] = action.payload;
                }
                state.status = action.payload.message;
            })
            .addCase(updatePointK.rejected, (state, action) => {
                state.loading = false;
                state.status = action.error.message;
            });
    },
});

// Экспортируем action для сброса статуса
export const { resetStatus } = pointSlice.actions;

export default pointSlice.reducer;