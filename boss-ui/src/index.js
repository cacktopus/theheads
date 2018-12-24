import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

// Redux related
import thunkMiddleware from 'redux-thunk'
import websocket from '@giantmachines/redux-websocket' // https://www.npmjs.com/package/@giantmachines/redux-websocket

// From : https://www.npmjs.com/package/redux-socket.io

// import createSocketIoMiddleware from 'redux-socket.io';
// import io from 'socket.io-client';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers';

// import {websocketConnect} from './actions';
import {websocketConnect, websocketTestSend} from './actions';

// let socket = io('wss://echo.websocket.org');
// // let socket = io('ws://echo.websocket.org');
// // let socket = io('http://localhost:3000');
// let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

// import { createSocketMiddleware } from "redux-websocket-middleware"
// createSocketMiddleware
// createWebsocketMiddleware



// const socketMiddleware = createWebsocketMiddleware({
//     defaultEndpoint: "ws://echo.websocket.org"
// })

// window.c_jj = rwm;

const store = createStore(
    rootReducer,
    applyMiddleware(
        // socketMiddleware,
        // socketIoMiddleware,
        websocket,
        thunkMiddleware, // lets us dispatch() functions
        // loggerMiddleware // neat middleware that logs actions
    )
);

// Connect to the websocket;
store.dispatch(websocketConnect())

window.c_ts = () => {
    console.log("going it");
    store.dispatch(websocketTestSend());
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
