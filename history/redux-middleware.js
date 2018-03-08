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

// 应用中间件
let applyMiddleware = (middleware) =>{
    // 返回新的函数  对createStore的增强
    return createStore => reducer =>{
        // 原始的store
        let store = createStore(reducer);

        middleware = middleware(store); // 加强版的store  next

        let dispatch = middleware(store.dispatch)// 加强版的 dispatch next(dispatch)
        return {
            // 解构 然后覆盖store dispatch
            ...store,dispatch
        }

    }
}

export {createStore ,applyMiddleware}

// middleware(store) 等同于下面

//     return function(next){
           // 等同于dispatch
//         return function(action){

//         }
//     }

