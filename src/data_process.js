const team_keys = [
  'FGM',
  'FGA',
  'FG%',
  '3P',
  '3PA',
  '3P%',
  'FTM',
  'FTA',
  'FT%',
  'ORB',
  'DRB',
  'TRB',
  'AST',
  'STL',
  'BLK',
  'TOV',
  'PF',
  'PTS',
  '+/-',
  'TS%',
  'eFG%',
  '3PAr',
  'ORtg',
  'DRtg',
  'Home Win%',
  'Away Win%',
];

const player_keys = [
  'FGA',
  'FG%',
  '3P',
  '3PA',
  '3P%',
  'FTM',
  'FTA',
  'FT%',
  'ORB',
  'DRB',
  'TRB',
  'AST',
  'STL',
  'BLK',
  'TOV',
  'PF',
  'PTS',
  'TS%',
  'eFG%',
  '3PAr',
];

//给出起始年到结束年的球员平均值数据
function select_year_team(data, start_year, end_year) {
  start = start_year - 2015;
  end = end_year - 2015;
  cover = end - start + 1;
  var new_data = [];
  l = data.length;
  for (i = 0; i < l; i = i + 6) {
    var temp_team = {};
    temp_team['Team'] = data[i]['Team'];
    for (var j in team_keys) {
      key = team_keys[j];
      var temp = 0;
      for (k = i + start; k <= i + end; k++) {
        temp = temp + parseFloat(data[k][key]);
      }
      temp_team[key] = temp / cover;
    }
    new_data.push(temp_team);
  }
  return new_data;
}

//给出起始年到结束年的球队平均值数据
function select_year_player(data, start_year, end_year) {
  var temp_m = {};
  for (let key of player_keys) {
    temp_m[key] = get_min_max(data, key);
  }
  var new_data = [];
  l = data.length;
  for (i = 0; i < l; i++) {
    var temp_player = {};
    var temp_b = 1;
    temp_player['Player'] = data[i]['Player'];
    for (var j in player_keys) {
      key = player_keys[j];
      var temp = 0;
      var temp_i = 0;
      for (k = start_year; k <= end_year; k++) {
        index = key + ' ' + k.toString();
        if (data[i][index] != '') {
          temp = temp + parseFloat(data[i][index]);
          temp_i++;
        }
      }
      if (temp_i == 0) {
        temp_player[key] = (temp_m[key][0] + temp_m[key][1]) / 2;
      } else {
        temp_b = 0;
        temp_player[key] = temp / temp_i;
      }
    }
    if (temp_b == 1) {
      continue;
    } else {
      new_data.push(temp_player);
    }
  }
  return new_data;
}

function get_team_index(data) {
  team_index = [];
  data.forEach((d) => {
    team_index.push(d['Team'][0]);
  });
  team_index = Array.from(new Set(team_index));
  return team_index;
}

//寻找所有数据项中属性为attr的最大最小值
function get_min_max(data, attr) {
  let min = 1e9;
  let max = -1e9;

  data.forEach((d) => {
    if (d[attr] != '') {
      let v = parseFloat(d[attr]);
      if (v > max) max = v;
      if (v < min) min = v;
    }
  });
  // console.log('attr', attr, 'min', min, 'max', max);

  return [min, max];
}

function dict_to_list_team(data) {
  var new_data = data;
  return new_data;
}

function dict_to_list_player(data) {
  var new_data = [];
  for (let player of data) {
    var temp_l = [];
    for (let key of player_keys) {
      var l_m = get_min_max(data, key);
      temp_l.push((player[key] - l_m[0]) / (l_m[1] - l_m[0]));
    }
    new_data.push(temp_l);
  }
  return new_data;
}

function makeAssignments(data, means) {
  //确定每个数据项属于哪一类，返回每个数据项所在类别的list
  var assignments = [];
  for (var i in data) {
    var point = data[i];
    var distances = [];
    for (var j in means) {
      var mean = means[j];
      var sum = 0;
      for (var dimension in point) {
        var difference = point[dimension] - mean[dimension];
        difference *= difference;
        sum += difference;
      }
      distances[j] = Math.sqrt(sum);
    }

    assignments.push(distances.indexOf(Math.min.apply(null, distances)));
  }

  return assignments;
}

function moveMeans(data, means, assignments) {
  //改变每个聚类中心点的位置，并判定这些中心点有无移动，返回布尔值
  var sums = Array(means.length);
  var counts = Array(means.length);
  var moved = false;

  for (var j in means) {
    counts[j] = 0;
    sums[j] = Array(means[j].length);
    for (var dimension in means[j]) {
      sums[j][dimension] = 0;
    }
  }

  for (var point_index in assignments) {
    var mean_index = assignments[point_index];
    var point = data[point_index];
    var mean = means[mean_index];

    counts[mean_index]++;

    for (var dimension in mean) {
      sums[mean_index][dimension] += point[dimension];
    }
  }

  for (var mean_index in sums) {
    for (var dimension in sums[mean_index]) {
      sums[mean_index][dimension] /= counts[mean_index];
    }
  }

  if (means.toString() !== sums.toString()) {
    moved = true;
  }

  means = sums;
  return moved;
}

function kmeans(ori_data, k, mode, max_iter = 1000) {
  // ori_data: 数据集, k:聚类数量
  // mode:数据类型——球队还是球员，max_iter:最大迭代次数
  // 返回assignments为一个list，包含每个数据所在类别
  if (mode == 'team') {
    var data = dict_to_list_team(ori_data);
  }
  if (mode == 'player') {
    var data = dict_to_list_player(ori_data);
  }
  var means = [];
  var id = [];
  /*data.forEach((d, i) => {
        id[i] = i;
    })
    for(var i = 0; i < k; i++){
        var temp = Math.random()*id.length >> 0;
        means.push(data[id.splice(temp, 1)]);
    }*/
  for (var i = 0; i < k; i++) means.push(data[i]);

  for (var i = 0; i < max_iter; i++) {
    var assignments = makeAssignments(data, means);
    var optimized = moveMeans(data, means, assignments);
    if (!optimized) console.log(i);
    break;
  }
  return assignments;
}

export { kmeans };
