import React from 'react'
import {ReactComponent as Recycling} from '../image/bio-leaves.svg';
import {ReactComponent as RecyclingMob} from '../image/bio-leaves.svg';
import { Link } from 'react-router-dom'
import {Button} from "../components/Button";

export const MainPage = () => {
    return (
        <section className={'w-full min-h-[90vh] flex-col xl:flex-row flex items-center justify-center px-6 xl:px-24 bg-white'}>
            <div className={'relative order-2 xl:order-1 w-full xl:w-1/2 xl:pr-12'}>
                <div className="space-y-6">
                    <h1 className={'text-4xl xl:text-6xl font-bold text-slate-800 tracking-tight'}>
                        Waste<span className="text-emerald-500">Wise</span>
                    </h1>
                    <p className={'text-slate-600 text-lg xl:text-xl leading-relaxed max-w-xl'}>
                        {`Инициатива, направленная на повышение осведомленности
о раздельном сборе отходов и активное привлечение людей
к этим важным действиям.`}
                    </p>
                    <div className="pt-4">
                        <Link to={'/articles'}>
                            <Button 
                                isFilled={true} 
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-lg text-base font-medium transition-all duration-200 ease-in-out shadow-[0_0_0_3px_rgba(16,185,129,0.1)] hover:shadow-[0_0_0_3px_rgba(16,185,129,0.2)]"
                            >
                                Читать
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Десктопная версия */}
            <div className={'hidden xl:flex xl:order-2 w-1/2 justify-center items-center'}>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full filter blur-3xl"></div>
                    <Recycling className="relative z-10" style={{ width: '380px', height: '380px', fill: '#10b981' }} />
                </div>
            </div>

            {/* Мобильная версия */}
            <div className={'flex xl:hidden w-full justify-center items-center order-1 mb-12'}>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full filter blur-3xl"></div>
                    <RecyclingMob className="relative z-10" style={{ width: '260px', height: '260px', fill: '#10b981' }} />
                </div>
            </div>
        </section>
    )
}
