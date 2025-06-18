import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    discounts: [],
    loading: false,
    status_disc: null,
}

export const UseDiscount = createAsyncThunk(
    'discount/UseDiscount',
    async (id, { rejectWithValue }) => {
        try {
            console.log(id)
            const { data } = await axios.put(`/used/discounts/${id}`, id)
            
            // Проверяем, есть ли ошибка с недостаточным количеством баллов
            if (data.errorType === 'insufficient_points') {
                return rejectWithValue(data);
            }
            
            return data
        } catch (error) {
            console.log(error)
            if (error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'Network error' });
        }
    }
)

export const discountSlice = createSlice({
    name: 'discount',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Использование скидки
            .addCase(UseDiscount.pending, (state) => {
                state.loading = true
                state.status_disc = null
            })
            .addCase(UseDiscount.fulfilled, (state, action) => {
                state.loading = false
                state.discounts = action.payload
                state.status_disc = action.payload.message
            })
            .addCase(UseDiscount.rejected, (state, action) => {
                state.loading = false
                state.status_disc = action.payload?.message
            })
    }
})

export default discountSlice.reducer
