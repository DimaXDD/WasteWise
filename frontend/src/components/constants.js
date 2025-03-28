import { BsFillFileRichtextFill, BsPercent, BsBuildingAdd } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BiAddToQueue, BiRecycle, BiPlusCircle, BiKey, BiMap } from "react-icons/bi";
import { GiScales } from "react-icons/gi";

export const ARTICLES = [
    {text: 'Статьи', icon: <BsFillFileRichtextFill/>, link: '/articles' }
];

export const ARTICLESUser = [
    {text: 'Статьи', icon: <BsFillFileRichtextFill/>, link: '/articles' },
    // {text: 'Добавить статью', icon: <BiAddToQueue/>, link: '/new' },
    {text: 'Добавить статью тест', icon: <BiAddToQueue/>, link: '/addarticle' }
];

export const MARKS = [
    {text: 'Виды вторсырья', icon: <BiRecycle/>, link: '/mark' }
];

export const MARKSAdmin = [
    {text: 'Виды вторсырья', icon: <BiRecycle/>, link: '/mark' },
    {text: 'Добавить вторсырье', icon: <BiPlusCircle/>, link: '/newmark' },
];

export const POINTSAdmin = [
    {text: 'Пункты приема', icon: <BiMap/>, link: '/point'}, // иконка
    {text: 'Добавить пункт приема', icon: <BsBuildingAdd/>, link: '/newpoint' }, // иконка
];

export const DISCOUNTS = [
    {text: 'Мои скидки', icon: <BsPercent/>, link: '/mydiscount' }
];

export const DISCOUNTSAdmin = [
    {text: 'Скидки', icon: <BsPercent/>, link: '/alldisсount' },
    // {text: 'Мои скидки', icon: <BsPercent/>, link: '/mydiscount' },
    {text: 'Добавить скидку', icon: <AiOutlinePlus/>, link: '/newdisсount' },
];

