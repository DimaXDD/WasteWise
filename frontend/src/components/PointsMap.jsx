import React, { useEffect, useRef, useState } from 'react';

export const PointsMap = ({ points = [], onPointClick, mapInstance = null }) => {
    const mapRef = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const placemarksRef = useRef([]);

    useEffect(() => {
        // Если карта уже загружена, используем её
        if (window.ymaps && mapInstance) {
            setIsMapLoaded(true);
            addPointsToMap(mapInstance);
        } else if (window.ymaps) {
            // Если API загружен, но нет экземпляра карты, создаем новый
            setIsMapLoaded(true);
            initMap();
        } else {
            // Если API не загружен, ждем
            const checkYmaps = setInterval(() => {
                if (window.ymaps) {
                    clearInterval(checkYmaps);
                    setIsMapLoaded(true);
                    if (mapInstance) {
                        addPointsToMap(mapInstance);
                    } else {
                        initMap();
                    }
                }
            }, 100);
        }
    }, [mapInstance, points]);

    const initMap = () => {
        if (!mapRef.current) return;

        // Создаем карту
        const map = new window.ymaps.Map(mapRef.current, {
            center: [55.76, 37.64], // Москва по умолчанию
            zoom: 10,
            controls: ['zoomControl', 'fullscreenControl']
        });

        // Добавляем точки на карту
        addPointsToMap(map);
    };

    const addPointsToMap = (map) => {
        if (!points || points.length === 0) return;

        // Очищаем предыдущие метки
        placemarksRef.current.forEach(placemark => {
            map.geoObjects.remove(placemark);
        });
        placemarksRef.current = [];

        const bounds = [];
        
        points.forEach((point, index) => {
            try {
                // Парсим координаты из ссылки
                const url = new URL(point.link_to_map);
                const pt = url.searchParams.get('pt');
                
                if (pt) {
                    const [lng, lat] = pt.split(',').map(Number);
                    const coords = [lat, lng];
                    bounds.push(coords);

                    // Создаем метку
                    const placemark = new window.ymaps.Placemark(coords, {
                        balloonContent: `
                            <div class="p-2">
                                <h3 class="font-semibold text-lg">${point.point_name}</h3>
                                <p class="text-sm text-gray-600">${point.address}</p>
                                <p class="text-sm text-gray-600">Время работы: ${point.time_of_work}</p>
                                <p class="text-sm text-gray-600">Принимает: ${point.rubbish}</p>
                            </div>
                        `
                    }, {
                        preset: 'islands#greenDotIcon'
                    });

                    // Добавляем обработчик клика только для показа информации
                    placemark.events.add('click', () => {
                        // Просто показываем информацию, не заполняем форму
                        console.log('Выбрана точка:', point.point_name);
                    });

                    placemarksRef.current.push(placemark);
                    map.geoObjects.add(placemark);
                }
            } catch (error) {
                console.error('Ошибка при добавлении точки:', error);
            }
        });

        // Устанавливаем границы карты, чтобы все точки были видны
        if (bounds.length > 0) {
            map.setBounds(bounds, { checkZoomRange: true });
        }
    };

    // Если используется существующая карта, не рендерим новую
    if (mapInstance) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">
                        Все пункты приема на карте
                    </h3>
                    <span className="text-sm text-slate-600">
                        {points.length} пунктов
                    </span>
                </div>
                
                <div className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">
                    Кликните на любую точку для просмотра информации
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                    Все пункты приема на карте
                </h3>
                <span className="text-sm text-slate-600">
                    {points.length} пунктов
                </span>
            </div>
            
            <div 
                ref={mapRef} 
                className="w-full h-96 rounded-lg border border-slate-300"
                style={{ minHeight: '400px' }}
            >
                {!isMapLoaded && (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-lg">
                        <div className="text-slate-600">Загрузка карты...</div>
                    </div>
                )}
            </div>
        </div>
    );
}; 