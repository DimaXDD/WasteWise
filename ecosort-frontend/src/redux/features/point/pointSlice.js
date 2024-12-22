import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    points: [],
    loading: false,
    status: null,
}

export const getPoints = createAsyncThunk(
    'point/getPoints',
    async () => {
        try {
            const { data } = await axios.get('/points')
            return data
        } catch (error) {
            console.log(error)
        }
    }
)

export const removePoint = createAsyncThunk(
    'point/removePoint',
    async (id) => {
        try {
            const { data } = await axios.delete(`/points/${id}`)
            return data
        } catch (error) {
            console.log(error)
        }
    }
)

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
            })
            return data
        } catch (error) {
            console.log(error)
        }
    }
)

export const updatePoint = createAsyncThunk(
    'point/updatePoint',
    async (updatedPoint) => {
        try {
            const { data } = await axios.put(`/points/${updatedPoint.id}`, updatedPoint)
            return data
        } catch (error) {
            console.log(error)
        }
    }
)

export const updatePointK = createAsyncThunk(
    'point/updatePointK',
    async (updatedPointK) => {
        try {
            const { data } = await axios.put(`/points/key/${updatedPointK.id}`, updatedPointK)
            return data
        } catch (error) {
            console.log(error)
        }
    }
)

export const pointSlice = createSlice({
    name: 'point',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Получить точки сбора
            .addCase(getPoints.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(getPoints.fulfilled, (state, action) => {
                state.loading = false
                state.points = action.payload.points
            })
            .addCase(getPoints.rejected, (state, action) => {
                state.loading = false
                state.status = action.payload?.message
            })

            // Удаление точки сбора
            .addCase(removePoint.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(removePoint.fulfilled, (state, action) => {
                state.loading = false
                state.points = state.points.filter(
                    (point) => point.id !== action.payload.id
                )
                state.status = action.payload.message
            })
            .addCase(removePoint.rejected, (state, action) => {
                state.loading = false
                state.status = action.payload?.message
            })

            // Добавление точки сбора
            .addCase(addPoint.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(addPoint.fulfilled, (state, action) => {
                state.loading = false
                state.points.push(action.payload)
                state.status = action.payload.message
            })
            .addCase(addPoint.rejected, (state, action) => {
                state.loading = false
                state.status = action.payload?.message
            })

            // Обновление точки сбора
            .addCase(updatePoint.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(updatePoint.fulfilled, (state, action) => {
                state.loading = false
                const index = state.points.findIndex((point) => point.id === action.payload.id)
                if (index !== -1) {
                    state.points[index] = action.payload
                }
                state.status = action.payload.message
            })
            .addCase(updatePoint.rejected, (state, action) => {
                state.loading = false
                state.status = action.payload?.message
            })

            // Обновление секретного ключа
            .addCase(updatePointK.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(updatePointK.fulfilled, (state, action) => {
                state.loading = false
                const index = state.points.findIndex((point) => point.id === action.payload.id)
                if (index !== -1) {
                    state.points[index] = action.payload
                }
                state.status = action.payload.message
            })
            .addCase(updatePointK.rejected, (state, action) => {
                state.loading = false
                state.status = action.payload?.message
            })
    },
})

export default pointSlice.reducer
