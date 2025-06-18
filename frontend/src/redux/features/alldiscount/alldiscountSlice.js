import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    alldiscounts: [],
    loading: false,
    status: null,
    valid: null,
}

export const getAllDiscounts = createAsyncThunk(
    'discount/getAllDiscounts',
    async () => {
        try {
            const { data } = await axios.get('/Discounts')
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

export const removeAllDiscount = createAsyncThunk(
    'discount/removeAllDiscount',
    async (id) => {
        try {
            const { data } = await axios.delete(`/Discounts/${id}`)
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

export const addDiscount = createAsyncThunk(
    'discount/addDiscount',
    async ({ discount, count_for_dnt, promo_code }) => {
        try {
            const { data } = await axios.post('/Discounts', { discount, count_for_dnt, promo_code })
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

export const updateDiscount = createAsyncThunk(
    'discount/updateDiscount',
    async (updatedDiscount) => {
        try {
            const { data } = await axios.put(`/discounts/${updatedDiscount.id}`, updatedDiscount)
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

export const myDiscount = createAsyncThunk(
    'discount/myDiscount',
    async () => {
        try {
            const { data } = await axios.get('/user/allDiscounts')
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

export const myUsedDiscount = createAsyncThunk(
    'discount/UseDiscount',
    async (id) => {
        try {
            const { data } = await axios.put(`/used/discounts/${id}`, id)
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

export const alldiscountSlice = createSlice({
    name: 'alldiscount',
    initialState,
    reducers: {
        clearStatus: (state) => {
            state.status = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Получить все скидки
            .addCase(getAllDiscounts.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(getAllDiscounts.fulfilled, (state, action) => {
                state.loading = false
                state.alldiscounts = action.payload.alldiscounts
            })
            .addCase(getAllDiscounts.rejected, (state, action) => {
                state.loading = false
                state.status = action.error.message || 'Ошибка при получении скидок'
            })

            // Удаление скидки
            .addCase(removeAllDiscount.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(removeAllDiscount.fulfilled, (state, action) => {
                state.loading = false
                state.alldiscounts = state.alldiscounts.filter(
                    (discount) => discount.id !== action.payload.id
                )
                state.status = action.payload.message || 'Скидка удалена'
            })
            .addCase(removeAllDiscount.rejected, (state, action) => {
                state.loading = false
                state.status = action.error.message || 'Ошибка при удалении скидки'
            })

            // Добавление скидки
            .addCase(addDiscount.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(addDiscount.fulfilled, (state, action) => {
                state.loading = false
                state.alldiscounts.push(action.payload)
                //state.status = action.payload.message || 'Скидка добавлена'
                state.valid = action.payload.msg || 'Действительная скидка'
            })
            .addCase(addDiscount.rejected, (state, action) => {
                state.loading = false
                state.status = action.error.message || 'Ошибка при добавлении скидки'
                state.valid = action.payload?.msg || 'Недействительная скидка'
            })

            // Обновление скидки
            .addCase(updateDiscount.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(updateDiscount.fulfilled, (state, action) => {
                state.loading = false
                const index = state.alldiscounts.findIndex(
                    (discount) => discount.id === action.payload.id
                )
                state.alldiscounts[index] = action.payload
                state.status = action.payload.message || 'Скидка обновлена'
            })
            .addCase(updateDiscount.rejected, (state, action) => {
                state.loading = false
                state.status = action.error.message || 'Ошибка при обновлении скидки'
            })

            // Получить мои скидки
            .addCase(myDiscount.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(myDiscount.fulfilled, (state, action) => {
                state.loading = false
                state.alldiscounts = action.payload.alldiscounts
            })
            .addCase(myDiscount.rejected, (state, action) => {
                state.loading = false
                state.status = action.error.message || 'Ошибка при получении моих скидок'
            })

            // Использовать скидку
            .addCase(myUsedDiscount.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(myUsedDiscount.fulfilled, (state, action) => {
                state.loading = false
                state.alldiscounts = action.payload
                state.status = action.payload.message || 'Скидка использована'
            })
            .addCase(myUsedDiscount.rejected, (state, action) => {
                state.loading = false
                state.status = action.error.message || 'Ошибка при использовании скидки'
            })
    }
})

export const { clearStatus } = alldiscountSlice.actions;

export default alldiscountSlice.reducer
