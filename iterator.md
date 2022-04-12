# 迭代器相关
## 可迭代协议 `Iteratable`
- 可迭代协议允许 `JavaScript` 对象定义或定制它们的迭代行为
- 一个对象要成为可迭代对象，需要实现 `@@iterator` 方法，它返回一个迭代器对象
- 一个对象被迭代时，会调用它的 `@@iterator` 方法获得一个迭代器，在迭代过程中获得要迭代的值
- 调用 `@@iterator` 方法时，`this` 关键字可用于访问可迭代对象的属性，以决定在迭代过程中提供什么
## 迭代器协议 `Iterator`
- 迭代器协议定义了产生一系列值的方式。当值为有限个时，所有的值都被迭代完毕后，则会返回一个默认返回值。
- 一个对象要成为迭代器对象，需要实现 `next` 方法，见 `TypeScript` 源码
## 使用迭代协议
- 直接使用
```js
let str = "hi";
typeof str[Symbol.iterator]; // "function"
let iterator = str[Symbol.iterator]();
iterator + "";  // "[object String Iterator]"

iterator.next(); // { value: "h", done: false }
iterator.next(); // { value: "i", done: false }
iterator.next(); // { value: undefined, done: true }
```
- 使用特定语法
    - 展开运算符只适用于数组浅拷贝和函数剩余参数
```js
let arr = [1, 2, 3, 4, 5];
let s = 0
for (let i of arr) {
    s += i;
    console.log(s); // 依次输出1, 3, 6, 10, 15
}

let arr2 = [...arr]

function* F() {
    yield* 'hello';
}
let f = F();
let done = false;
do {
    let next = f.next();
    console.log(next.value); // 依次输出h, e, l, l, o, undefined
    done = next.done;
} while (!done)

let [a, b, c] = new Set(["a", "b", "c"]);
```
## 实现迭代协议的内置对象
- `Array`, `String`, `Map`, `Set`, `arguments`
## 生成器函数 `Generator Function`
- 生成器函数在执行时能暂停，又能从暂停处继续执行
- 生成器函数返回一个迭代器对象，它被迭代时，会依次执行到 `yield` 关键字后出现的表达式，表达式的返回值作为当前迭代值
- `yield*` 关键字将迭代过程委托给另一个可迭代对象
- 语法
    - `function* name([param[, param[, ... param]]]) { statements }`
    - `yield` 关键字
    - `yield*` 关键字
- 使用生成器实现 `async/await`
- 生成器对象既是可迭代对象，也是迭代器对象
```js
async function asyncF() {
    const promiseA = Promise.resolve(1);
    let a = await promiseA;
    console.log(a);
    const promiseB = new Promise((r) => {
        setTimeout(() => {
            r(2);
        }, 1000);
    })
    let b = await promiseB;
    console.log(b);
}

asyncF();

function async(generator){  
    let gen = generator();  
    let result;
    while(1) {
      result = gen.next()
      if (result.done) {
        break;
      } else {
        gen.next();
      }
    }
    return result.value;
}

function* generatorF() {
    let promiseA = Promise.resolve(1);
    let a;
    yield promiseA.then((res) => {
        a = res;
        console.log(a);
    });
    let promiseB = new Promise((r) => {
        setTimeout(() => {
            r(2);
        }, 1000);
    })
    let b;
    yield promiseB.then((res) => {
        b = res;
        console.log(b);
    });
    return Promise.resolve();
}

async(generatorF);
```
## 自定义迭代器
- 有限的
```js
function makeIterator(array) {
    let nextIndex = 0;
    return {
       next: function () {
           return nextIndex < array.length ? {
               value: array[nextIndex++],
               done: false
           } : {
               done: true
           };
       }
    };
}

let it = makeIterator([1, 2]);
```
- 无限的
```js
function idMaker() {
    let index = 0;
    return {
       next: function() {
           return {
               value: index++,
               done: false
           };
       }
    };
}

let it = idMaker();
```
- 使用生成器
```js
function* makeSimpleGenerator(array) {
    let nextIndex = 0;

    while(nextIndex < array.length) {
        yield array[nextIndex++];
    }
}

let gen = makeSimpleGenerator([1, 2]);
```
```js
function* idMaker() {
    let index = 0;
    while (true) {
        yield index++;
    }
}

let gen = idMaker();
```
## 实现可迭代的数据类型
- 实现 `[...5]` 得到 `[1, 2, 3, 4, 5]`
```js
Number.prototype[Symbol.iterator] = function() {
    const value = this.valueOf();
    let count = 0;
    let done = false;
    return {
        next() {
            count++;
            if (count > value) {
                done = true;
            }
            return {
                value: done ? undefined : count,
                done,
            }
        },
    }
}
[...5]; // [1, 2, 3, 4, 5]
```

下次打算介绍一下`Symbol`上的属性和它们的用途。本次已经介绍了 `Symbol.Iterator` 。