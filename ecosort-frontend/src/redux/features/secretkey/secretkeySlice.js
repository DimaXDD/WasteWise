import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const initialState = {
    secretkeys: [],
    loading: false,
    status_sk: null,
};

// Вспомогательная функция для обработки ошибок
const handleAsyncThunkError = (error) => {
    console.log(error);
    //throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
};

export const addSecretKey = createAsyncThunk(
    'secretkey/addSecretKey',
    async ({ secret_key }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/keys', { secret_key });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при добавлении ключа');
        }
    }
);

export const secretkeySlice = createSlice({
    name: 'secretkey',
    initialState,
    reducers: {
        resetStatusSk: (state) => {
            state.status_sk = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addSecretKey.pending, (state) => {
                state.loading = true;
                state.status_sk = null;
            })
            .addCase(addSecretKey.fulfilled, (state, action) => {
                state.loading = false;
                state.secretkeys.push(action.payload);
                //state.status_sk = action.payload.message; // "Ключ добавлен"
            })
            .addCase(addSecretKey.rejected, (state, action) => {
                state.loading = false;
                state.status_sk = action.payload || 'Ошибка при добавлении ключа';
            });
    },
});
// Экспортируем action для сброса статуса
export const { resetStatusSk } = secretkeySlice.actions;

export default secretkeySlice.reducer;