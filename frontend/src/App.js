import {Layout} from './components/Layout.jsx'
import {Routes, Route} from 'react-router-dom'
import {MainPage} from './pages/MainPage.jsx'
import {ArticlePage} from './pages/ArticlePage.jsx'
import {RegisterPage} from "./pages/RegisterPage";
import {LoginPage} from "./pages/LoginPage";
import {PointPage} from "./pages/PointPage.jsx";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import { getMe, setIsAuth } from './redux/features/auth/authSlice.js'
import {MyDiscountPage} from "./pages/MyDiscountPage";
import {MarksPage} from "./pages/MarksPage";
import {ReceptionPage} from "./pages/ReceptionPage";
import {AllDiscointPage} from "./pages/AllDiscointPage";
import {AddPointPage} from "./pages/AddPointPage";
import {AddDisсountPage} from "./pages/AddDisсountPage";
import {AddMarksPage} from "./pages/AddMarksPage";
import {UpdatePointPage} from "./pages/UpdatePointPage";
import {UpdateSecretKeyPage} from "./pages/UpdateSecretKeyPage";
import {UpdateDiscountPage} from "./pages/UpdateDiscountPage";
import {UpdateMarkPage} from "./pages/UpdateMarkPage";
import {Wrapper} from "./components/Wrapper";
import {Header} from "./components/Header";
import {AllArticlesPage} from "./pages/AllArticlesPage";
import {AddArticlesPage} from "./pages/AddArticlesPage";
import {UpArticlesPage} from "./pages/UpArticlesPage";
import {PointsMarksPage} from "./pages/PointsMarksPage";
import {ChangeUsername} from "./pages/ChangeUsername";
import {ChangePassPage} from "./pages/ChangePassPage";
import {ProtectedRoute} from "./components/ProtectedRoute";
// import {TestPage} from "./pages/TestPage";
import RecycleCamera from "./components/RecycleCamera";

function App() {

    const dispatch = useDispatch()

    const isAuth = () => {
        return window.localStorage.getItem('accessToken')
    }

    console.log(isAuth())

    useEffect(() => {
        // Проверяем авторизацию при загрузке приложения
        if (isAuth()) {
            dispatch(getMe())
        }
        dispatch(setIsAuth(isAuth()))
        console.log('1')
    }, [dispatch])

  return (
    // <Layout>
        <Wrapper>
            <Header/>
            <Routes>
                {/*<Route path='test' element={<TestPage/>}/>*/}

                <Route path='login' element={<LoginPage/>}/>
                <Route path='register' element={<RegisterPage/>}/>
                <Route path='change/username' element={<ChangeUsername/>}/>
                <Route path='change/pass' element={<ChangePassPage/>}/>

                <Route path='/' element={<MainPage/>}/>

                <Route path='articles' element={<AllArticlesPage/>}/>
                <Route path='addarticle' element={<ProtectedRoute><AddArticlesPage/></ProtectedRoute>}/>
                <Route path=':id' element={<ArticlePage/>}/>
                <Route path=':id/edit' element={<ProtectedRoute><UpArticlesPage/></ProtectedRoute>}/>

                <Route path='reception' element={<ProtectedRoute><ReceptionPage/></ProtectedRoute>}/>

                <Route path='mark' element={<MarksPage/>}/>
                <Route path='newmark' element={<ProtectedRoute><AddMarksPage/></ProtectedRoute>}/>
                <Route path=':id/editmark' element={<ProtectedRoute><UpdateMarkPage/></ProtectedRoute>}/>
                <Route path=':id/pointsmark' element={<ProtectedRoute><PointsMarksPage/></ProtectedRoute>}/>
                {/*<Route path='newweight' element={<AddWeightPage/>}/>*/}


                <Route path='point' element={<PointPage/>}/>
                <Route path='newpoint' element={<ProtectedRoute><AddPointPage/></ProtectedRoute>}/>
                <Route path=':id/editpoint' element={<ProtectedRoute><UpdatePointPage/></ProtectedRoute>}/>
                <Route path=':id/editpointk' element={<ProtectedRoute><UpdateSecretKeyPage/></ProtectedRoute>}/>
                {/*<Route path='newkey' element={<AddSecretKeyPage/>}/>*/}

                <Route path='mydiscount' element={<ProtectedRoute><MyDiscountPage/></ProtectedRoute>}/>
                <Route path='alldisсount' element={<ProtectedRoute><AllDiscointPage/></ProtectedRoute>}/>
                <Route path='newdisсount' element={<ProtectedRoute><AddDisсountPage/></ProtectedRoute>}/>
                <Route path=':id/editdiscount' element={<ProtectedRoute><UpdateDiscountPage/></ProtectedRoute>}/>


                <Route path="/recycle-camera" element={<ProtectedRoute><RecycleCamera /></ProtectedRoute>} />
            </Routes>
            <ToastContainer position='bottom-right' />
        </Wrapper>

     // </Layout>
    );
}

export default App;
