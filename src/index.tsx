import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './routes/App';
import reportWebVitals from './reportWebVitals';

import { Auth0Provider } from "@auth0/auth0-react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import MidiMouth from './routes/MidiMouth';

ReactDOM.render(
    <Auth0Provider
        // If you are using a custom domain with Auth0, the value of the domain property is 
        //the value of your custom domain instead of the value reflected in the "Settings" tab.
        domain="dev-9c8pon97.us.auth0.com"
        clientId="cofJDIegnz1wWXwQiDA2Qda0lCQ4uKDL"
        redirectUri={window.location.origin}
        audience="https://YOUR_DOMAIN/api/v2/"
        scope="read:current_user update:current_user_metadata"
    >
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="midi-mouth" element={<MidiMouth />} />
            </Routes>
        </BrowserRouter>

    </Auth0Provider>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
