import React from 'react'
import {ReactComponent as Recycling} from '../image/bio-leaves.svg';
import {ReactComponent as RecyclingMob} from '../image/bio-leaves.svg';
import { Link } from 'react-router-dom'
import {Button} from "../components/Button";

export const MainPage = () => {
    return (
        <section className={'w-full flex-col xl:flex-row flex mt-10 justify-between px-6 xl:px-20'}>
            <div className={'relative order-2 xl:order-1 text-center w-full xl:w-2/4 xl:text-left xl:mt-32 mt-16'}>
                <h1 className={'text-4xl xl:text-7xl text-green-700 font-bold'}>
                    WasteWise
                </h1>
                <p className={'text-gray-700 opacity-80 text-lg my-8 leading-relaxed'}>
                    {`Инициатива, направленная на повышение осведомленности
о раздельном сборе отходов и активное привлечение людей
к этим важным действиям.`}
                </p>
                <Link to={'/articles'}>
                    <Button isFilled={true} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md">Читать</Button>
                </Link>
            </div>

            {/* Десктопная версия */}
            <div 
                className={
                    'hidden xl:flex xl:order-2 w-2/4 justify-center items-center mt-10'
                }>
                <Recycling style={{ width: '350px', height: '350px', fill: '#4CAF50' }} />
            </div>

            {/* Мобильная версия */}
            <div 
                className={
                    'flex xl:hidden w-full justify-center items-center order-1 mt-8'
                }>
                <RecyclingMob style={{ width: '280px', height: '280px', fill: '#4CAF50' }} />
            </div>
        </section>
    )
}
