import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    users: [],
    loading: false,
    status: null,
}

export const getUser = createAsyncThunk(
    'user/getUser',
    async () => {
        try {
            const { data } = await axios.get('/Users')  // обновите путь
            return data
        } catch (error) {
            console.log(error)
            throw error  // выбрасываем ошибку для дальнейшей обработки в .rejected
        }
    }
)

export const changeUsername = createAsyncThunk(
    'user/changeUsername',
    async (updatedUsername) => {
        try {
            const { data } = await axios.put('/user', updatedUsername)
            return data
        } catch (error) {
            console.log(error)
            throw error // выбрасываем ошибку для дальнейшей обработки в .rejected
        }
    }
)

export const changePass = createAsyncThunk(
    'user/changePass',
    async (updatedPass) => {
        try {
            const { data } = await axios.put('/user/pass', updatedPass)
            return data
        } catch (error) {
            console.log(error)
            throw error // выбрасываем ошибку для дальнейшей обработки в .rejected
        }
    }
)

export const getUserM = createAsyncThunk(
    'user/getUserM',  // поменял имя для уникальности
    async () => {
        try {
            const { data } = await axios.get('/User')  // обновите путь
            return data
        } catch (error) {
            console.log(error)
            throw error  // выбрасываем ошибку для дальнейшей обработки в .rejected
        }
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Получить всех пользователей
            .addCase(getUser.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload.users || []
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false
                state.status = action.error.message || 'Ошибка получения данных'
            })

            // Получить одного пользователя (переименовано getUserM)
            .addCase(getUserM.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(getUserM.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload.users || []
            })
            .addCase(getUserM.rejected, (state, action) => {
                state.loading = false
                state.status = action.error.message || 'Ошибка получения данных'
            })

            // Изменить имя пользователя
            .addCase(changeUsername.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(changeUsername.fulfilled, (state, action) => {
                state.loading = false
                const index = state.users.findIndex((user) => user.id === action.payload.id)
                if (index !== -1) state.users[index] = action.payload
                state.status = action.payload.message || 'Имя пользователя изменено'
            })
            .addCase(changeUsername.rejected, (state, action) => {
                state.loading = false
                state.status = action.error.message || 'Ошибка при изменении имени'
            })

            // Изменить пароль пользователя
            .addCase(changePass.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(changePass.fulfilled, (state, action) => {
                state.loading = false
                const index = state.users.findIndex((user) => user.id === action.payload.id)
                if (index !== -1) state.users[index] = action.payload
                state.status = action.payload.message || 'Пароль изменен'
            })
            .addCase(changePass.rejected, (state, action) => {
                state.loading = false
                state.status = action.error.message || 'Ошибка при изменении пароля'
            })
    }
})

export default userSlice.reducer
