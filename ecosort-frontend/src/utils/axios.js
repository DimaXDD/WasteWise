import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8082',
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('accessToken')

    return config
})

export default instance