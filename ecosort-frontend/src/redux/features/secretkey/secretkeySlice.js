import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    secretkeys: [],
    loading: false,
    status_sk: null,
}

export const addSecretKey = createAsyncThunk(
    'secretkey/addSecretKey',
    async ({ secret_key }) => {
        try {
            const { data } = await axios.post('/keys', { secret_key })
            return data
        } catch (error) {
            console.log(error)
            throw error // При ошибке, чтобы ошибка была правильно обработана
        }
    }
)

export const secretkeySlice = createSlice({
    name: 'secretkey',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Добавить секретный ключ
            .addCase(addSecretKey.pending, (state) => {
                state.loading = true
                state.status_sk = null
            })
            .addCase(addSecretKey.fulfilled, (state, action) => {
                state.loading = false
                state.secretkeys.push(action.payload) // Добавляем новый секретный ключ в массив
                state.status_sk = action.payload.message || 'Секретный ключ добавлен'
            })
            .addCase(addSecretKey.rejected, (state, action) => {
                state.loading = false
                // Обрабатываем ошибку, проверяя error.message
                state.status_sk = action.error.message || 'Ошибка при добавлении секретного ключа'
            })
    }
})

export default secretkeySlice.reducer
