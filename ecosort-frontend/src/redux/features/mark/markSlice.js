import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    marks: [],
    loading: false,
    status: null,
}

// Получить отходы
export const getMark = createAsyncThunk(
    'mark/getMark',
    async () => {
        try {
            const { data } = await axios.get('/marks')
            return data
        } catch (error) {
            console.log(error)
        }
    }
)

// Удаление отхода
export const removeMark = createAsyncThunk(
    'mark/removeMark',
    async (id) => {
        try {
            const { data } = await axios.delete(`/marks/${id}`);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
)

// Добавление отхода
export const addMark = createAsyncThunk(
    'mark/addMark',
    async ({ rubbish, points_per_kg, new_from_kg, image_link }) => {
        try {
            const { data } = await axios.post('/marks', {
                rubbish, points_per_kg, new_from_kg, image_link
            })
            return data
        } catch (error) {
            console.log(error)
        }
    }
)

// Обновление отхода
export const updateMark = createAsyncThunk(
    'mark/updateMark',
    async (updatedMark) => {
        try {
            const { data } = await axios.put(`/marks/${updatedMark.id}`, updatedMark)
            return data
        } catch (error) {
            console.log(error)
        }
    }
)

export const markSlice = createSlice({
    name: 'mark',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Получить отходы
            .addCase(getMark.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(getMark.fulfilled, (state, action) => {
                state.loading = false
                state.marks = action.payload.marks || [] // безопасное присваивание
            })
            .addCase(getMark.rejected, (state, action) => {
                state.loading = false
                state.status = action.payload?.message || 'Ошибка загрузки'
            })

            // Удаление отхода
            .addCase(removeMark.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(removeMark.fulfilled, (state, action) => {
                state.loading = false
                state.marks = state.marks.filter((mark) => mark.id !== action.payload.id)
                state.status = action.payload.message
            })
            .addCase(removeMark.rejected, (state, action) => {
                state.loading = false
                state.status = action.payload?.message || 'Ошибка удаления'
            })

            // Добавление отхода
            .addCase(addMark.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(addMark.fulfilled, (state, action) => {
                state.loading = false
                state.marks.push(action.payload) // добавляем новый объект в массив
                state.status = action.payload.message
            })
            .addCase(addMark.rejected, (state, action) => {
                state.loading = false
                state.status = action.payload?.message || 'Ошибка добавления'
            })

            // Обновление отхода
            .addCase(updateMark.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(updateMark.fulfilled, (state, action) => {
                state.loading = false
                const index = state.marks.findIndex((mark) => mark.id === action.payload.id)
                if (index >= 0) {
                    state.marks[index] = action.payload
                }
                state.status = action.payload.message
            })
            .addCase(updateMark.rejected, (state, action) => {
                state.loading = false
                state.status = action.payload?.message || 'Ошибка обновления'
            })
    }
})

export default markSlice.reducer
