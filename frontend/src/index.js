import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import{BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <GoogleOAuthProvider clientId="417247634120-eeih0qte0s10s7cuanrtvo7a4r2kmmqh.apps.googleusercontent.com">
        <Provider store={store}>
            <App />
        </Provider>
        </GoogleOAuthProvider>
    </BrowserRouter>
);
