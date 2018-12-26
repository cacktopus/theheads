import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

// Redux related
import thunkMiddleware from 'redux-thunk'
import websocket from '@giantmachines/redux-websocket'

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers';
import { customWebsocketMiddleware } from './middleware';

const store = createStore(
    rootReducer,
    applyMiddleware(
        // socketMiddleware,
        // socketIoMiddleware,
        websocket,
        thunkMiddleware, // lets us dispatch() functions
        customWebsocketMiddleware
        // loggerMiddleware // neat middleware that logs actions
    )
);

// // Connect to the websocket;
// store.dispatch(websocketConnect())

// window.c_ts = () => {
//     console.log("going it");
//     store.dispatch(websocketSend("hi there"));
// }

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
