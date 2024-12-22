import React from 'react'
// import Recycling from '../image/Recycling.svg';
import {ReactComponent as Recycling} from '../image/Recycling.svg';
import {ReactComponent as RecyclingMob} from '../image/Recycling.svg';
import { Link } from 'react-router-dom'

import {Button} from "../components/Button";
// import {ArticleItem} from "../components/ArticleItem";
// import {useDispatch, useSelector} from "react-redux";
// import {getArticles} from "../redux/features/articles/articleSlice";
//
export const MainPage = () => {
    return (
        <section className={'w-full flex-col xl:flex-row flex mt-6 justify-between'}>
            <div className={'relative order-2 xl:order-1 text-center w-full xl:w-2/4 xl:text-left xl:mt-40 mt-12'}>
                <h1 className={'text-3xl xl:text-8xl text-cyan-950 font-semibold'}>
                    ЭкоБудущее
                </h1>
                <p className={'text-cyan-950 opacity-75 text-lg my-10 whitespace-pre-line'}>
                    {`представляет собой инициативу,\n направленную на повышение осведомленности о раздельном\n сборе бытовых отходов и активное привлечение людей к этим важным действиям`}
                </p>
                <Link to={'/articles'}><Button isFilled={true} className={''}>Читать</Button></Link>
            </div>
            <div className={'hidden xl:flex xl:order-2 w-2/4 mt-16 '}>
                <Recycling/>
            </div>
            <div className={'flex xl:hidden w-full  justify-center order-1'}>
                <RecyclingMob/>
            </div>
        </section>

    )
}


//     const dispatch = useDispatch()
//     const {article} = useSelector((state) => state.articles)
//
//     useEffect(() => {
//         dispatch(getArticles({}));
//         // window.location.reload();
//     }, [dispatch])
//
//     if(!article.length){
//         return(
//             <div className={'text-xl text-center text-white py-10'}>
//                 Статей не существует
//             </div>
//         )
//     }
//   return (
//       <div className={'max-w-[900px] mx-auto py-10'}>
//         <div className={'flex justify-between gap-8'}>
//           <div className={'flex flex-col gap-10 basis-4/5'}>
//               {article?.map((articles, idx) => (<ArticleItem key={idx} articles={articles}/>))}
//           </div>
//           <div className={'basis-1/5'}>
//             <div className={'text-xs uppercase text-white'}>
//
//             </div>
//           </div>
//         </div>
//       </div>
//   )
// }
