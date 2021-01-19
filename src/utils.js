function getActualDim(selector) {
  const element = document.querySelector(selector);
  const width = Math.min(element.clientWidth, element.scrollWidth);
  const height = Math.min(element.clientHeight, element.scrollHeight);
  return [width, height];
}

function getMinMax(data, attr) {
  let min = 1e9,
    max = 0;
  data.forEach((d) => {
    let v = parseInt(d[attr]);
    if (v > max) max = v;
    if (v < min) min = v;
  });
  return [min, max];
}

function boundValue(value, min, max) {
  return value < min ? min : value > max ? max : value;
}

function countDistinct(data, attr) {
  let set = new Set();
  let ret = [];
  for (const d of data) {
    if (set.has(d[attr])) continue;
    ret.push(d[attr]);
    set.add(d[attr]);
  }
  return ret;
}

function get_team(data){
  let map = [];
  data.forEach(d => {
    if(!map.includes(d['Team']))
      map.push(d['Team']);
  });
  return map;
}

export { getActualDim, getMinMax, boundValue, countDistinct, get_team };
