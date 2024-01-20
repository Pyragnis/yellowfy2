import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import socketReducer from './reducers/socketReducer';
import searchReducer from './reducers/searchReducer';




const rootReducer = combineReducers({
    socket: socketReducer,
    search: searchReducer
});


export const store = createStore(
    rootReducer, 
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);
