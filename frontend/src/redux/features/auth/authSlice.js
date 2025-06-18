import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    user: null,
    accessToken: null,
    isLoading: false,
    error: null,
}

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ username, email, password, isGoogleAuth = false }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/register', {
                username,
                email,
                password,
                isGoogleAuth
            });
            
            if (data.errors) {
                return rejectWithValue(data);
            }
            
            return data;
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'Network error' });
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password, isGoogleAuth = false }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/login', {
                email,
                password,
                isGoogleAuth
            })
            
            // Проверяем, есть ли ошибка с неправильным способом авторизации
            if (data.errorType === 'wrong_auth_method') {
                return rejectWithValue(data);
            }
            
            if (data.accessToken) {
                window.localStorage.setItem('accessToken', data.accessToken)
            }
            return data
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'Network error' });
        }
    },
)

export const getMe = createAsyncThunk('auth/getMe', async () => {
    try {
        const { data } = await axios.get('/me')
        return data
    } catch (error) {
        console.log(error)
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.isLoading = false
            state.error = null
        },
        setIsAuth: (state, action) => {
            state.accessToken = action.payload
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        // Register user
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user
                state.accessToken = action.payload.accessToken
                state.error = null
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })

        // Login user
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user
                state.accessToken = window.localStorage.getItem('accessToken')
                state.error = null
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })

        // Проверка авторизации
        builder
            .addCase(getMe.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload?.user
                state.accessToken = action.payload?.accessToken
            })
            .addCase(getMe.rejected, (state) => {
                state.isLoading = false
            })
    },
})

export const checkIsAuth = (state) => Boolean(state.auth.accessToken)

export const { logout, setIsAuth, clearError } = authSlice.actions

export default authSlice.reducer
