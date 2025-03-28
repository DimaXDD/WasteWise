import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    article: [],
    loading: false,
    status: null,
}

export const createArticles = createAsyncThunk(
    'articles/createArticles',
    async ({ title, text, image_url }) => {
        try {
            const { data } = await axios.post('/articles', {
                title, text, image_url,
            })
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

export const getArticles = createAsyncThunk(
    'articles/getArticles',
    async () => {
        try {
            const { data } = await axios.get('/articles');
            console.log("Fetched articles data: ", data); // Проверка данных
            return data;
        } catch (error) {
            console.log(error);
        }
    }
);

export const removeArticles = createAsyncThunk(
    'articles/removeArticles',
    async (id) => {
        try {
            const { data } = await axios.delete(`/articles/${id}`, id)
            return data
        } catch (error) {
            console.log(error)
        }
    }
)

export const updateArticles = createAsyncThunk(
    'articles/updateArticles',
    async (updatedArticles) => {
        try {
            console.log(updatedArticles)
            const { data } = await axios.put(
                `/articles/${updatedArticles.id}`,
                updatedArticles,
            )
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

export const Likes = createAsyncThunk(
    'articles/Likes',
    async (id) => {
        try {
            console.log(id)
            const { data } = await axios.put(`/like/${id}`, id)
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

export const articleSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        clearStatus: (state) => {
            state.status = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Создание статьи
            .addCase(createArticles.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(createArticles.fulfilled, (state, action) => {
                state.loading = false
                state.image_url = action.payload.image_url
                state.title = action.payload.title
                state.text = action.payload.text
                state.status = action.payload.message
            })
            .addCase(createArticles.rejected, (state, action) => {
                state.status = action.payload?.message
                state.loading = false
            })

            // Получение всех статей
            .addCase(getArticles.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.loading = false
                state.article = action.payload.articles
            })
            .addCase(getArticles.rejected, (state, action) => {
                state.loading = false
                state.status = action.payload?.message
            })

            // Удаление статьи
            .addCase(removeArticles.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(removeArticles.fulfilled, (state, action) => {
                state.loading = false
                state.status = action.payload?.message
                state.article = state.article.filter(
                    (articles) => articles.id !== action.payload.id
                )
            })
            .addCase(removeArticles.rejected, (state, action) => {
                state.status = action.payload?.message
                state.loading = false
            })

            // Обновление статьи
            .addCase(updateArticles.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(updateArticles.fulfilled, (state, action) => {
                state.loading = false
                state.status = action.payload?.message
                const index = state.article.findIndex(
                    (articles) => articles.id === action.payload.id
                )
                if (index !== -1) {
                    state.article[index] = action.payload
                }
            })
            .addCase(updateArticles.rejected, (state, action) => {
                state.status = action.payload?.message
                state.loading = false
            })

            // Лайк статьи
            .addCase(Likes.pending, (state) => {
                state.loading = true
                state.status = null
            })
            .addCase(Likes.fulfilled, (state, action) => {
                state.loading = false
                state.status = action.payload?.message
                state.article = action.payload
            })
            .addCase(Likes.rejected, (state, action) => {
                state.status = action.payload?.message
                state.loading = false
            })
    },
})

export const { clearStatus } = articleSlice.actions;

export default articleSlice.reducer
