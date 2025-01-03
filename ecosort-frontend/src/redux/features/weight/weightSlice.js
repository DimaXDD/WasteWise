import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    weights: [],
    loading: false,
    status_weight: null,
}

export const addWeight = createAsyncThunk(
    'point/addPoint',
    async ({ rubbish_w, weight, key_of_weight, original_key }) => {
        try {
            const { data } = await axios.post('/weight', { rubbish_w, weight, key_of_weight, original_key })
            return data
        } catch (error) {
            console.log(error)
            throw error // Предотвращаем ошибки, чтобы они могли быть пойманы в rejected
        }
    }
)

export const weightSlice = createSlice({
    name: 'weight',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // При добавлении нового веса
            .addCase(addWeight.pending, (state) => {
                state.loading = true
                state.status_weight = null
            })
            .addCase(addWeight.fulfilled, (state, action) => {
                state.loading = false
                // Добавляем новый объект в массив
                state.weights.push(action.payload)
                state.status_weight = action.payload.message || 'Вес успешно добавлен'
            })
            .addCase(addWeight.rejected, (state, action) => {
                state.loading = false
                // Если ошибка, возвращаем сообщение ошибки из action.error
                state.status_weight = action.error.message || 'Ошибка при добавлении веса'
            })
    }
})

export default weightSlice.reducer
