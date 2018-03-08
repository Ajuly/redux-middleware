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
// 中间件的好处，这部分代码只需要写一次
let logger = store => next => action =>{
    console.log("before" + store.getState());
    console.log(action);
    next(action);
    console.log("after" + store.getState());
}
// 上面的函数等价于
// let logger = function(store){
//     return function(next){
//         return function(action){

//         }
//     }

// }

let store = applyMiddleware(logger)(createStore)(counter);

// applyMiddleware(logger)(createStore) 这里返回一个函数等同于store
// 下面的值赋值给store
// {
//     ...store,dispatch
// }

// store调用dispatch
store.dispatch({type:'ADD'});
store.dispatch({type:'SUB'});


ReactDOM.render(<p>123</p>, document.getElementById('root'));
