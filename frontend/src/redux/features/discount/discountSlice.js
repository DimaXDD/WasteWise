import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    discounts: [],
    loading: false,
    status_disc: null,
}

export const UseDiscount = createAsyncThunk(
    'discount/UseDiscount',
    async (id) => {
        try {
            console.log(id)
            const { data } = await axios.put(`/used/discounts/${id}`, id)
            return data
        } catch (error) {
            console.log(error)
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
