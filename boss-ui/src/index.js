import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

// Redux related
import thunkMiddleware from 'redux-thunk'
import websocket from '@giantmachines/redux-websocket' // https://www.npmjs.com/package/@giantmachines/redux-websocket
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers';


const store = createStore(
    rootReducer,
    applyMiddleware(
        websocket,
        thunkMiddleware, // lets us dispatch() functions
        // loggerMiddleware // neat middleware that logs actions
    )
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
