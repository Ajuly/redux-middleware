## redux中间件
### 1.实现日志中间件

**中间件是对store、dispatch的加强**或者说是对dispatch的一种封装。

![](https://ws1.sinaimg.cn/large/006tNc79gy1fp5dj0bzinj30go03874e.jpg
)
![](https://ws1.sinaimg.cn/large/006tNc79gy1fp5djxv7hxj30go03ojrr.jpg)

    let logger = store => next => action =>{
    
    }
    
    // 上面的函数等价于
    let logger = function(store){
        return function(next){
            return function(action){
    
            }
        }
    
    }
    
    ]

--------------------------------

  
  
  index.js
  
    // 中间件
    // let logger = function(store){
    //     return function(next){
    //         return function(action){
    
    //         }
    //     }
    
    // }
  
    let logger = store => next => action =>{
        // 中间件的好处，这部分代码只需要写一次
        console.log("before" + store.getState()); // 1
        console.log(action);
        
        next(action);
        
        console.log("after" + store.getState()); // 0
    }
    
    let store = applyMiddleware(logger)(createStore)(counter);
    
    store.dispatch({type:'ADD'});
    store.dispatch({type:'SUB'}); 
    
    
    // applyMiddleware(logger)(createStore) 这里返回一个函数等同于store
    // 下面的值赋值给store
    // {
    //     ...store,dispatch
    // }
    
    
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
    
    
**有哪些应用场景？**
### 2.实现异步的中间件 

-------
 
### 1.异步的中间件：redux-thunk

**实现3s加一的异步功能**

    // 异步的中间件
    let thunk = store => next => action => {
        if(typeof action === 'function')
            // 如果action是函数就执行action
            return action(next);
        // 否则就dispatch
        return next(action);
    }
    
    let store = applyMiddleware(thunk)(createStore)(counter);
    
    // 订阅
    store.subscribe(function(){
        console.log(store.getState());
    })
    
    // dispatch 实现隔三秒钟再加一  dispatch也可以传递一个函数
    store.dispatch(function(dispatch){
        setTimeout(() => {
            dispatch({type:'ADD'})
        }, 3000);
    });
    
    
### 2.异步的中间件：redux-promise

    let isPromise = obj => obj.then;
    // 异步的中间件
    let promise = store => next => action => {
        if(isPromise(action)){
            action.then((data) => next(data));
        }
        next(action);
    }
    
    let store = applyMiddleware(promise)(createStore)(counter);
    
    store.dispatch(new Promise(function(resolve,reject){
        setTimeout(() => {
            resolve({type:'ADD'});
        }, 3000);
    }));
    
    store.subscribe(function(){
        console.log(store.getState());
    })


## 中间件的链式调用

-------

**reduceRight():** 从数组的末尾向前将数组中的数组项做累加

array.reduceRight(function(total, currentValue, currentIndex, arr), initialValue)

![](https://ws1.sinaimg.cn/large/006tNc79gy1fp5peho807j30w20eadie.jpg)


-------

**组合函数：**

    function compose(...fns){
    
        return function(...args){
            let last = fns.pop(); //sum

            return fns.reduceRight((composed,fn)=>{
        			console.log(composed); //cd 
        			console.log(fn);// upper
                    return fn(composed);
                },last(...args))
            }
            //last(...args)  cd
    }
    
    let sum = (a,b) => a+b;
    let upper = str => str.toUpperCase();
    
    let result = compose(upper,sum)('c','d');
    
    console.log(result); // CD
    
 
-------
   

**src/redux.js**
    
    let applyMiddleware = (...middlewares) => createStore => reducer => {
            let store = createStore(reducer);
            let dispatch = store.dispatch;
            middlewares = middlewares.map(middleware=>middleware({getState:store.getState,dispatch:action=>dispatch(action)}));
            dispatch = compose(...middlewares)(store.dispatch);
            return {...store, dispatch}
    }
    
    function compose(...funcs) {
        return args => funcs.reduceRight((composed, f) => f(composed), args);
    }
    
**src/index.js**
    
    let logger1 = store => next => action => {
        console.log('before1', store.getState());
        next(action);
        console.log('after1', store.getState());
    }
    let logger2 = store => next => action => {
        console.log('before2', store.getState());
        next(action);
        console.log('after2', store.getState());}
    let store = applyMiddleware(logger2,logger1)(createStore)(reducer);



    
    
    
    



 
    


