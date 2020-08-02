import React, { useState, useMemo, memo, useCallback } from "react";

// 注意：Child 接收了 addClick 函数作为参数
// 如果没有对该函数做缓存，会导致 addClick 重复创建新的内存对象。

let Child = ({ data, addClick }) => {
  console.log("Child组件渲染了");
  return <button onClick={addClick}>{data.number}</button>;
};

// memo：让函数组件拥有了记忆的功能，只有当组件内部状态发生变更的时候才会重新渲染。
// 但是，由于addClick 是一个函数，如果不做缓存处理，每次都是一个新的值，会导致Child组件渲染。

Child = memo(Child);

let lastAddClick, lastData;

export const UseMemoPerformance = () => {
  let [number, setNumber] = useState(0);
  let [name, setName] = useState("");

  //第一个参数deps,表示此函数缓存依赖的项，依赖改变后才会创建新的函数。
  const addClick = useCallback(() => setNumber(number + 1), [number]);

  console.log("lastAddClick === addClick", lastAddClick === addClick);

  lastAddClick = addClick;
  // 比useCallback厉害之处在于能够缓存函数的返回值，其解决的问题是相同的（缓存）
  const data = useMemo(() => ({ number }), [number]);
  console.log("lastData === data", lastData === data);
  lastData = data;
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Child addClick={addClick} data={data} />
    </div>
  );
};
