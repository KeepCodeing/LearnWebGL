function calDate(dateStr) {

  const result = [];

  const [start, end] = dateStr.split('~');

  const startDateTime = new Date(start + ' 00:00:00').getTime();

  const endDateTime = new Date(end + ' 00:00:00').getTime();

  for (let s = startDateTime; s <= endDateTime; s += 60 * 60 * 24 * 1000)  result.push(new Date(s).toLocaleDateString().replaceAll('/', '-'));


  return result;
}

// console.log(calDate('2022-08-01~2022-09-13'))

function unique(arr) {
  const set = new Set();
  const objSet = new Set();
  const result = []
  for (const item of arr) {
    if (Object.prototype.toString.call(item) === '[object Object]') {
      if (objSet.has(item.a)) continue;
      objSet.add(item.a);
      result.push(item);
    } else {
      if (Object.prototype.toString.call(item) === '[object Array]') {
        const str = item.join(' ');
        if (set.has(str)) continue;
        set.add(str);
        result.push(item);
        continue;
      }
      if (set.has(item)) continue;
      set.add(item);
      result.push(item);
    }
  }
  return result;
}

// console.log(unique([1, 2, 3, "4", 1, 2, 3, "4", { a: 1 }, { a: 1 }, { a: 2 }, { a: 2 }, [1, 2, 3], [1, 2, 3]]))

function toTree(arr) {
  const map = new Map();
  for (const item of arr) {
    map[item.id] = { ...item, children: [] };
  }
  let result = {};
  for (const item of arr) {
    if (item.parentId === null) {
      // result[item.id] = map[item.id];
      result = map[item.id]
      // map[item.id] = item;
      continue;
    }
    if (!map[item.parentId]) map[item.id] = { ...item, children: [] };
    else {
      // console.log(map[item.parentId])
      map[item.parentId].children.push(map[item.id]);
    }
  }
  // console.log(map)
  return [result];
}

const res = toTree([{ parentId: null, name: "湖北省", id: 1 }, { parentId: 1, name: "武汉市", id: 2 }, { parentId: 2, name: "洪山区", id: 3 }]);


(function dfs(arr) { console.log(arr); if (!arr.length) return; for (const item of arr) { console.log(item.name); dfs(item.children); } })(res)

console.log()