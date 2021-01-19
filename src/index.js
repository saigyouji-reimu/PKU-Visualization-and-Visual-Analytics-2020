import * as d3 from 'd3';
import { TimeSpan } from './timespan';
import { getActualDim } from './utils';
import { Parallel } from './parallel_coord';
import { BarChart } from './bar_chart';

let [_width, _height] = getActualDim('body');
let width = 0.9 * _width;
let height = 0.9 * _height;
let team_data_file = 'team_data/team.json';

let svg;

const Oattr = ['FGA', 'FG%', '3PA', '3P%', 'FTA', 'PTS', 'ORtg', 'Home Win%'];
const Dattr = ['ORB', 'DRB', 'STL', 'BLK', 'PF', 'DRtg', 'Away Win%'];
const YEARS = [2016, 2017, 2018, 2019, 2020];

function init(team_data, years, attr) {
  svg.remove();

  svg = d3
    .select('#team')
    .append('svg')
    .attr('id', 'Parallel')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(' + 0 + ',' + -400 + ')');

  let Par = new Parallel('#Parallel');

  team_data = team_data.filter((d, i) => years.includes(d['Season']));

  Par.draw(team_data, years, attr);
}

function initial(team_data, player_data) {
  let ts = new TimeSpan('#times', team_data);
  let para = new Parallel('#team');
  let barc = new BarChart('#detail');
  const pbtn = document.getElementById('pbtn');

  ts.draw_line();
  ts.draw_circles();

  const years = [2015, 2016, 2017, 2018, 2019, 2020];
  const bar_data_o = barc.gen_data(team_data, 'Golden State Warriors', Oattr);
  barc.draw(bar_data_o, years);

  let nyears = years;
  let Tattr = Oattr;
  ts.set_listener(() => {
    nyears = years.filter((d) => d >= ts.start && d <= ts.end);
    para.draw(team_data, nyears, Tattr);
    barc.draw(Tattr === Oattr ? bar_data_o : bar_data_d, nyears);
  });

  /*
    设置listener后，触发事件会把平行坐标轴的svg隐藏掉
    想要重新显示视图调用par.show();
  */
  para.set_listener((d) => {
    console.log(d);
    nyears = years.filter((f) => f >= ts.start && f <= ts.end);
    barc.draw(barc.gen_data(team_data, 'Golden State Warriors', Tattr), nyears);
  });
  para.draw(team_data, years, Oattr);
}

function main() {
  Promise.all([d3.json('data/team.json'), d3.json('data/player.json')]).then(
    (lst) => {
      initial(lst[0], lst[1]);
    },
  );
}

main();
