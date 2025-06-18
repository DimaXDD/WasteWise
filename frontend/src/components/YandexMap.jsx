import React, { useEffect, useRef, useState } from 'react';
import { getYandexMapsApiUrl } from '../config/yandexMaps';

export const YandexMap = ({ onLocationSelect, initialLink = null, showExistingPoints = false, existingPoints = [] }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const placemarkRef = useRef(null);
    const existingPlacemarksRef = useRef([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = getYandexMapsApiUrl();
        script.async = true;
        
        script.onload = () => {
            window.ymaps.ready(() => {
                setIsMapLoaded(true);
                initMap();
            });
        };

        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current || !isMapLoaded) return;

        if (showExistingPoints) {
            addExistingPointsToMap();
        } else {
            removeExistingPointsFromMap();
        }
    }, [showExistingPoints, existingPoints, isMapLoaded]);

    const getAddressByCoords = async (coords) => {
        try {
            const response = await window.ymaps.geocode(coords, {
                results: 1
            });
            
            if (response.geoObjects.getLength() > 0) {
                const firstGeoObject = response.geoObjects.get(0);
                return firstGeoObject.getAddressLine();
            }
            return null;
        } catch (error) {
            console.error('Ошибка при получении адреса:', error);
            return null;
        }
    };

    const initMap = () => {
        if (!mapRef.current) return;

        const map = new window.ymaps.Map(mapRef.current, {
            center: [55.76, 37.64], // Москва по умолчанию
            zoom: 10,
            controls: ['zoomControl', 'fullscreenControl']
        });

        mapInstanceRef.current = map;

        map.events.add('click', async (e) => {
            const coords = e.get('coords');
            setSelectedLocation(coords);
            
            // Удаляем предыдущую метку
            if (placemarkRef.current) {
                map.geoObjects.remove(placemarkRef.current);
            }

            const address = await getAddressByCoords(coords);

            const placemark = new window.ymaps.Placemark(coords, {
                balloonContent: address || 'Выбранная точка'
            }, {
                preset: 'islands#redDotIcon'
            });

            placemarkRef.current = placemark;
            map.geoObjects.add(placemark);

            const link = `https://yandex.ru/maps/?pt=${coords[1]},${coords[0]}&z=16&l=map`;
            
            if (onLocationSelect) {
                onLocationSelect(link, coords, address);
            }
        });

        if (initialLink) {
            loadLocationFromLink(initialLink, map);
        }
    };

    const loadLocationFromLink = async (link, map) => {
        try {
            const url = new URL(link);
            const pt = url.searchParams.get('pt');
            
            if (pt) {
                const [lng, lat] = pt.split(',').map(Number);
                const coords = [lat, lng];
                
                map.setCenter(coords, 16);
                
                const address = await getAddressByCoords(coords);
                
                const placemark = new window.ymaps.Placemark(coords, {
                    balloonContent: address || 'Текущая точка'
                }, {
                    preset: 'islands#blueDotIcon'
                });

                placemarkRef.current = placemark;
                map.geoObjects.add(placemark);
                setSelectedLocation(coords);

                if (onLocationSelect) {
                    onLocationSelect(link, coords, address);
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке ссылки:', error);
        }
    };

    const handleSearch = async (query) => {
        if (!mapInstanceRef.current) return;

        window.ymaps.geocode(query, {
            results: 1
        }).then(async (res) => {
            if (res.geoObjects.getLength() > 0) {
                const firstGeoObject = res.geoObjects.get(0);
                const coords = firstGeoObject.geometry.getCoordinates();
                const address = firstGeoObject.getAddressLine();
                
                mapInstanceRef.current.setCenter(coords, 16);

                if (placemarkRef.current) {
                    mapInstanceRef.current.geoObjects.remove(placemarkRef.current);
                }

                const placemark = new window.ymaps.Placemark(coords, {
                    balloonContent: address
                }, {
                    preset: 'islands#redDotIcon'
                });

                placemarkRef.current = placemark;
                mapInstanceRef.current.geoObjects.add(placemark);
                setSelectedLocation(coords);

                const link = `https://yandex.ru/maps/?pt=${coords[1]},${coords[0]}&z=16&l=map`;
                if (onLocationSelect) {
                    onLocationSelect(link, coords, address);
                }
            }
        });
    };

    const addExistingPointsToMap = () => {
        if (!existingPoints || existingPoints.length === 0) return;

        const bounds = [];
        
        existingPoints.forEach((point) => {
            try {
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

                    existingPlacemarksRef.current.push(placemark);
                    mapInstanceRef.current.geoObjects.add(placemark);
                }
            } catch (error) {
                console.error('Ошибка при добавлении точки:', error);
            }
        });

        if (bounds.length > 0) {
            mapInstanceRef.current.setBounds(bounds, { checkZoomRange: true });
        }
    };

    const removeExistingPointsFromMap = () => {
        existingPlacemarksRef.current.forEach(placemark => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.geoObjects.remove(placemark);
            }
        });
        existingPlacemarksRef.current = [];
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Поиск по адресу..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(e.target.value);
                        }
                    }}
                />
                <button
                    onClick={() => {
                        const input = document.querySelector('input[placeholder="Поиск по адресу..."]');
                        if (input) handleSearch(input.value);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    Найти
                </button>
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
            
            {selectedLocation && (
                <div className="text-sm text-slate-600">
                    Выбрана точка: {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
                </div>
            )}

            {/* Информация о существующих точках */}
            {showExistingPoints && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Все пункты приема на карте
                        </h3>
                        <span className="text-sm text-slate-600">
                            {existingPoints.length} пунктов
                        </span>
                    </div>
                    
                    <div className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">
                        Кликните на любую точку для просмотра информации
                    </div>
                </div>
            )}
        </div>
    );
}; 