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

// 多个中间件进行链式调用
let logger1 = store => next => action => {
    console.log('logger1 before',store.getState());
    next(action);
    console.log('logger1 after',store.getState());
}

let logger2 = store => next => action => {
    console.log('logger2 before',store.getState());
    next(action);
    console.log('logger2 after',store.getState());
}

// 多个中间件：从左向右以此执行
let store = applyMiddleware(logger1,logger2)(createStore)(counter);

store.subscribe(function(){
    console.log(store.getState());
})

store.dispatch({type:'ADD'});


// logger1 before 0
// logger2 before 0
// 1
// logger2 after 1
// logger1 after 1



ReactDOM.render(<p>123</p>, document.getElementById('root'));
