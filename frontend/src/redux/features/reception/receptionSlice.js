import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    receptions: [],
    loading: false,
    status: null,
}

export const createReception = createAsyncThunk(
    'reception/createReception',
    async ({ weight, type_waste, station_key, key_of_weight }) => {
        try {
            const { data } = await axios.post('/receptions', {
                weight, type_waste, station_key, key_of_weight,
            })
            return data
        } catch (error) {
            console.log(error)
            throw error  // Это поможет обработать ошибку в блоке rejected
        }
    }
)

export const receptionSlice = createSlice({
    name: 'reception',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Прием отходов
            .addCase(createReception.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(createReception.fulfilled, (state, action) => {
                state.loading = false
                // Добавление нового объекта приема отходов в массив
                state.receptions.push(action.payload)
                state.status = action.payload.message || 'Прием успешен'
            })
            .addCase(createReception.rejected, (state, action) => {
                state.loading = false
                // Проверка на наличие поля message в action.payload
                state.status = action.payload?.message || 'Ошибка при приеме'
            })
    }
})

export default receptionSlice.reducer
