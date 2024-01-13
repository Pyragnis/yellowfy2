import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import socketReducer from './reducers/socketReducer';




const rootReducer = combineReducers({
    socket: socketReducer,
});


export const store = createStore(
    rootReducer, 
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);
