// Конфигурация для Яндекс Карт
export const YANDEX_MAPS_CONFIG = {
    API_KEY: 'da7078b5-a5e6-4bcc-82c8-805a367c1d64', // Замените на ваш API ключ
    VERSION: '2.1',
    LANGUAGE: 'ru_RU'
};

// Функция для получения URL API
export const getYandexMapsApiUrl = () => {
    return `https://api-maps.yandex.ru/${YANDEX_MAPS_CONFIG.VERSION}/?apikey=${YANDEX_MAPS_CONFIG.API_KEY}&lang=${YANDEX_MAPS_CONFIG.LANGUAGE}`;
}; 