import { configureStore } from '@reduxjs/toolkit'
import authSlice from './features/auth/authSlice'
import articleSlice from "./features/articles/articleSlice";
import commentSlice from "./features/comment/commentSlice";
import pointSlice from "./features/point/pointSlice";
import point_markSlice from "./features/point_mark/point_markSlice";
import discountSlice from "./features/discount/discountSlice";
import markSlice from "./features/mark/markSlice";
import receptionSlice from "./features/reception/receptionSlice";
import alldiscountSlice from "./features/alldiscount/alldiscountSlice";
import secretkeySlice from "./features/secretkey/secretkeySlice";
import weightSlice from "./features/weight/weightSlice";
import userSlice from "./features/user/userSlice";
import promo_codeSlice from "./features/promo_code/promo_codeSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        articles: articleSlice,
        comment: commentSlice,
        point: pointSlice,
        point_mark: point_markSlice,
        discount: discountSlice,
        mark: markSlice,
        reception: receptionSlice,
        alldiscount: alldiscountSlice,
        secretkey: secretkeySlice,
        weight: weightSlice,
        user: userSlice,
        promo_code: promo_codeSlice,
    },
})