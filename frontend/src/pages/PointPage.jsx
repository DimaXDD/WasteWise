import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PointItem } from '../components/PointItem';
import { useDispatch, useSelector } from 'react-redux';
import { getPoints } from '../redux/features/point/pointSlice';
import { toast } from 'react-toastify';

export const PointPage = () => {
    const dispatch = useDispatch();
    const { points } = useSelector((state) => state.point);
    const { user } = useSelector((state) => state.auth);
    const { status } = useSelector((state) => state.point);
    const { status_sk } = useSelector((state) => state.secretkey);

    useEffect(() => {
        dispatch(getPoints());
        if (status) toast(status);
        if (status_sk) toast(status_sk);
    }, [dispatch, status, status_sk]);

    if (!points.length) {
        return (
            <section className="w-full flex flex-col items-center justify-center min-h-[80vh]">
                <div className="text-center space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-800">Пунктов приема не существует</h2>
                    {user?.role === "admin" && (
                        <Link
                            to="/newpoint"
                            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                            Добавить пункт приема
                        </Link>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section className="w-full flex flex-col items-center mt-6">
            <div className="w-full max-w-[1200px] px-6">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-slate-800">Пункты приема</h1>
                        <p className="text-slate-600">Адреса и время работы всех пунктов приема</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 justify-center">
                        {points?.map((point) => (
                            <PointItem key={point.id} point={point} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};