export const YANDEX_MAPS_CONFIG = {
    API_KEY: process.env.REACT_APP_YANDEX_MAPS_API_KEY,
    VERSION: '2.1',
    LANGUAGE: 'ru_RU'
};

export const getYandexMapsApiUrl = () => {
    return `https://api-maps.yandex.ru/${YANDEX_MAPS_CONFIG.VERSION}/?apikey=${YANDEX_MAPS_CONFIG.API_KEY}&lang=${YANDEX_MAPS_CONFIG.LANGUAGE}`;
}; 