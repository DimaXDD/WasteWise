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

    return(
    <section className={'w-full flex-col xl:flex-row flex mt-6 justify-between'}>
        <div className={'relative order-2 xl:order-1 text-center w-full xl:w-3/4 xl:text-left '}>
            <div className={'flex items-center justify-center text-4xl text-cyan-900'}>
                Ваши скидки и балллы:  {users.points}
            </div>
            <div className={'max-w-[1200px] mx-auto py-10 '}>
                <div className={'flex justify-between gap-10'}>
                    <div className={'flex flex-wrap gap-20  '}>
                        {alldiscounts && alldiscounts.length > 0 ? (
                            <div className={'flex flex-wrap gap-20'}>
                                {alldiscounts.map((alldiscount) => (
                                    <DiscountItem key={alldiscount.id} alldiscount={alldiscount} />
                                ))}
                            </div>
                        ) : (
                            <div className={'flex items-center justify-center text-4xl text-cyan-900 ml-96'}>
                                Скидок нет...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <div className={'relative order-2 xl:order-1 text-center w-full xl:w-1/4 xl:text-left '}>
            <div className={'flex items-center justify-center text-4xl text-cyan-900'}>
                Ваши промокоды
            </div>
            <div>
                <div className={'max-w-[1200px] mx-auto py-10 '}>
                    <div className={'flex flex-col gap-3  '}>
                        {promo_codes && promo_codes.length > 0 ? (
                            promo_codes.map((promo_code) => (
                                <PromoCodeItem key={promo_code.id} promo_code={promo_code} />
                            ))
                        ) : (
                            <div className={'flex items-center justify-center text-2xl text-cyan-900'}>
                                Промокодов нет...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    </section>

)
}
