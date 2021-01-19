import * as d3 from 'd3';
import { TimeSpan } from './timespan';
import { SingleSpan } from './singlespan';
import { getActualDim } from './utils';
import { Parallel } from './parallel_coord';

let [_width, _height] = getActualDim('body');
let width = 0.9 * _width;
let height = 0.9 * _height;
let team_data_file = 'team_data/team.json';

let svg;

const Oattr = ['FGA', 'FG%', '3PA', '3P%', 'FTA', 'PTS', 'ORtg', 'Home Win%'];
const Dattr = ['ORB', 'DRB', 'STL', 'BLK', 'PF', 'DRtg', 'Away Win%'];

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

  /*
    设置listener后，触发事件会把平行坐标轴的svg隐藏掉
    想要重新显示视图调用par.show();
  */
  Par.set_listener((d) => {
    //d3.select('text').text(d);
  });
}

function initial(team_data, player_data) {
  let para = Parallel('#team');
  let ts = new TimeSpan('#p1', team_data);
  ts.draw_line();
  ts.draw_circles();

  let ss = new SingleSpan('#s1', [0, 1], true);
  ss.draw_line();
  ss.draw_circles();

  let years = [2015, 2016, 2017, 2018, 2019, 2020];
  let nyears = years;
  let Tattr = Oattr;

  ts.set_listener(() => {
    nyears = years.filter((d) => d >= ts.start && d <= ts.end);
    init(team_data, nyears, Tattr);
  });

  ss.set_listener(() => {
    if (ss.start == 0) Tattr = Oattr;
    else Tattr = Dattr;
    init(team_data, nyears, Tattr);
  });

  init(team_data, years, Oattr);
}

function main() {
  Promise.all([d3.json('data/team.json'), d3.json('data/player.json')]).then(
    (lst) => {
      initial(lst[0], lst[1]);
    },
  );
}

main();
