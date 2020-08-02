// import React, { useState, useMemo, memo, useCallback } from "react";
// let Child = (props) => {
//   console.log("Child组件渲染了");
//   return <button onClick={props.addClick}>{props.data.number}</button>;
// };
// //就让函数组件拥有了记忆的功能，只有当组件的属性发生变更的时候才会刷新，否则不刷新
// // 但由于Child组件接受了一个函数作为props的成员，所以在App组件刷新时如果没有对函数做优化，依然会导致Child组件刷新
// Child = memo(Child);
// let lastAddClick;
// let lastData;
// export const UseMemoPerformance = () => {
//   let [number, setNumber] = useState(0);
//   let [name, setName] = useState("zhufeng");
//   //第一个参数deps,表示此函数缓存依赖的变量，如果变量变了,会重新生成函数，否则每次的addClick函数会复用
//   // 这种情况下，函数内部的number没有发生联动，导致addClick并不能真正的设置setNumber的值
//   // const addClick = useCallback(() => setNumber(number + 1), []);
//   const addClick = useCallback(() => setNumber(number + 1), [number]);
//   console.log("lastAddClick === addClick", lastAddClick === addClick);
//   lastAddClick = addClick;
//   // 比useCallback厉害之处在于能够缓存函数的返回值，其解决的问题是一样的。
//   const data = useMemo(() => ({ number }), [number]);
//   console.log("lastData === data", lastData === data);
//   lastData = data;
//   return (
//     <div>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <Child addClick={addClick} data={data} />
//     </div>
//   );
// };

// !!! useCallback 当内部使用了useState后，需要注意依赖项的问题
// 这种情况下，函数内部的number没有发生联动，导致addClick并不能真正的设置setNumber的值
// const addClick = useCallback(() => setNumber(number + 1), []);
