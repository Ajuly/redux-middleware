let createStore = (reducer) => {

    let state;
    let listeners = [];

    let getState = () => state;

    // 订阅
    let subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            // 不等于的就会留下，等于的就会被删除
            listeners = listeners.filter(l => l !== listener);
        }
    }

    let dispatch = action => {
        // newstate
        state = reducer(state, action);
        listeners.forEach(l => l());
    }

    dispatch();

    return {
        getState,
        subscribe,
        dispatch
    }
}

// 应用中间件  单个
// let applyMiddleware = (middleware) =>{
//     // 返回新的函数  对createStore的增强
//     return createStore => reducer =>{
//         // 原始的store
//         let store = createStore(reducer);

//         middleware = middleware(store); // 加强版的store  next

//         let dispatch = middleware(store.dispatch)// 加强版的 dispatch next(dispatch)
//         return {
//             // 解构 然后覆盖store dispatch
//             ...store,dispatch
//         }

//     }
// }

// 应用中间件  多个
let applyMiddleware = (...middlewares) =>{
    return createStore => reducer =>{
        let store = createStore(reducer);
        middlewares = middlewares.map(middleware => middleware(store));
        // dispatch要包含所有中间件的逻辑
        let dispatch = compose(...middlewares)(store.dispatch);
        return {
            ...store,dispatch
        }
    }
}

function compose(...fns){
    return function(...args){
        let last = fns.pop(); //sum 
        return fns.reduceRight((composed,fn)=>{
            // composed ab
            // fn upper
            return fn(composed);
        },last(...args))
        // last(...args)  ab
    }
}


// 什么是组合函数 ？
// 简单的小例子
let sum = (a,b) => a+b;
let upper = str => str.toUpperCase();
// let result = upper(sum('a','b'));
let result = compose(upper,sum)('a','b');
console.log(result); // AB




export {createStore ,applyMiddleware}



