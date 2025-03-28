import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'
import { removeComment } from "../comment/commentSlice";

const initialState = {
    promo_codes: [],
    loading: false,
    status_promo: null,
}

// Получить промокоды
export const getPromoCodes = createAsyncThunk(
    'promo_codes/getPromoCodes',
    async () => {
        try {
            const { data } = await axios.get('/promo')
            return data
        } catch (error) {
            console.log(error)
            throw error // выбрасываем ошибку для обработки в .rejected
        }
    },
)

// Удалить промокод
export const removePromoCodes = createAsyncThunk(
    'promo_codes/removePromoCodes',
    async (id) => {
        try {
            const { data } = await axios.delete(`/promo/${id}`);
            return data;
        } catch (error) {
            console.log(error)
            throw error // выбрасываем ошибку для обработки в .rejected
        }
    }
);

export const promo_codeSlice = createSlice({
    name: 'promo_codes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Получить промокоды
            .addCase(getPromoCodes.pending, (state) => {
                state.loading = true
                state.status_promo = null
            })
            .addCase(getPromoCodes.fulfilled, (state, action) => {
                state.loading = false
                // Обрабатываем полученные данные: убедимся, что есть поле promo_codes
                state.promo_codes = action.payload.promo_codes || []
            })
            .addCase(getPromoCodes.rejected, (state, action) => {
                state.loading = false
                // Обработка ошибок: используем action.error.message для ошибки
                state.status_promo = action.error.message || 'Ошибка получения промокодов'
            })

            // Удалить промокод
            .addCase(removePromoCodes.pending, (state) => {
                state.loading = true
                state.status_promo = null
            })
            .addCase(removePromoCodes.fulfilled, (state, action) => {
                state.loading = false
                state.status_promo = action.payload.message || 'Промокод успешно удалён'
                // Удаляем промокод из списка
                state.promo_codes = state.promo_codes.filter(
                    (promo_code) => promo_code.id !== action.payload.id
                );
            })
            .addCase(removePromoCodes.rejected, (state, action) => {
                state.loading = false
                state.status_promo = action.error.message || 'Ошибка при удалении промокода'
            })
    }
})

export default promo_codeSlice.reducer
