import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {DiscountItem} from "../components/DiscountItem";
import {PromoCodeItem} from "../components/PromoCodeItem";
import {getUserM} from "../redux/features/user/userSlice";
import {myDiscount} from "../redux/features/alldiscount/alldiscountSlice";
import {toast} from "react-toastify";
import {getPromoCodes} from "../redux/features/promo_code/promo_codeSlice";

export const MyDiscountPage = () => {
    const dispatch = useDispatch()
    const {alldiscounts} = useSelector((state) => state.alldiscount)
    const {promo_codes} = useSelector((state) => state.promo_code)
    const {users} = useSelector((state) => state.user)
    const { status } = useSelector((state) => state.alldiscount)
    const { status_promo } = useSelector((state) => state.promo_code)
    // const { status_disc } = useSelector((state) => state.discount)


    console.log(users)

    useEffect(() => {
        dispatch(myDiscount())
        dispatch(getUserM())
        dispatch(getPromoCodes())
        if (status) toast(status)
        if (status_promo) toast(status_promo)
        // if (status_disc) toast(status_disc)
    }, [dispatch, status, status_promo
        // , status_disc
    ])

    return (
        <section className="w-full min-h-[80vh] py-8">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid xl:grid-cols-3 gap-8">
                    {/* Основной контент - скидки */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-slate-800">Все скидки</h1>
                                <div className="text-lg font-medium text-emerald-600">
                                    Баллы: {users.points}
                                </div>
                            </div>
                            
                            {alldiscounts && alldiscounts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {alldiscounts.map((alldiscount) => (
                                        <DiscountItem key={alldiscount.id} alldiscount={alldiscount} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-500 text-lg">Скидки не найдены</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Боковая панель - промокоды */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Ваши промокоды</h2>
                            
                            {promo_codes && promo_codes.length > 0 ? (
                                <div className="space-y-4">
                                    {promo_codes.map((promo_code) => (
                                        <PromoCodeItem key={promo_code.id} promo_code={promo_code} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-500 text-lg">У вас пока нет промокодов</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
