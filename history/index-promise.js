import React from 'react';
import ReactDOM from 'react-dom';

import {createStore,applyMiddleware} from './redux'

// reducer
let counter = (state = 0,action) => {
    if(action){
        switch (action.type) {
            case "ADD":
                return state = state + 1;
            case "SUB":
                return state = state - 1;
            default:
                return state;
        }
    }else{
        return state;
    }
    
}

// 异步的中间件
let thunk = store => next => action => {
    if(typeof action === 'function')
        return action(next);
    return next(action);
}



let store = applyMiddleware(thunk)(createStore)(counter);


// dispatch 实现隔三秒钟再加一  dispatch也可以传递一个函数
store.dispatch(function(dispatch){
    setTimeout(() => {
        dispatch({type:'ADD'})
    }, 3000);
});

store.subscribe(function(){
    console.log(store.getState());
})



ReactDOM.render(<p>123</p>, document.getElementById('root'));
