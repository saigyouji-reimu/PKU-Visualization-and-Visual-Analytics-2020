import * as d3 from 'd3';
import { TimeSpan } from './timespan';
import { Parallel } from './parallel_coord';
import { BarChart } from './bar_chart';
import { SingleButton } from "./singlebutton";
import { getActualDim, get_team } from "./utils";

let [_width, _height] = getActualDim('body');
let width = 0.9 * _width;
let height = 0.9 * _height;
let team_data_file = 'team_data/team.json';

let svg;
let Par;

const Oattr = ['FGA', 'FG%', '3PA', '3P%', 'FTA', 'PTS', 'ORtg', 'Home Win%'];
const Dattr = ['ORB', 'DRB', 'STL', 'BLK', 'PF', 'DRtg', 'Away Win%'];
const YEARS = [2016, 2017, 2018, 2019, 2020];

// function init(team_data, years, attr) {
//   svg.remove();

//     svg = d3.select('#team')
//         .append('svg')
//         .attr('id', 'Parallel')
//         .attr('width', width)
//         .attr('height', height)
//         .attr("transform", "translate(" + 0 + "," + 0 + ")");
    
//     Par = new Parallel('#Parallel');
    
//     Par.draw(Data, years, attr);

//     /*
//         设置listener后，触发事件会把平行坐标轴的svg隐藏掉
//         想要重新显示视图调用par.show();
//     */
//     Par.set_listener((d) => {
//         //d3.select('text').text(d);
//         d3.select('#s1')
//             .style("visibility", "hidden");
//         //把攻防选择条隐藏，调用问par.show()以后也要设置成visiable
//     });
// }

// function initial(Data){
    
//     let div = d3.select('#team');
//     div.append('p')
//         .attr('id', 'Range')
//         .attr('class', 'label')
//         .text('Range Selected: ')
//         .append('span')
//         .attr('id', "range")
//         .text('[2015, 2021]');

//     div.append('svg')
//         .attr('id', 'p1')
//         .attr('height', 24)
//         .attr('width', 500)
//         .attr("transform", "translate(" + 300 + "," + -45 + ")");

//     div.append('svg')
//         .attr('id', 's1')
//         .attr('width', 100)
//         .attr('height', 24)
//         .attr("transform", "translate(" + 300 + "," + -45 + ")");
    
//     svg = div.append('svg')
//         .attr('id', 'Parallel');

//     let ts = new TimeSpan('#p1', Data);
//     ts.draw_line();
//     ts.draw_circles();

//     let ss = new SingleButton('#s1', ['offence', 'defence']);
//     ss.draw_rect();

//     let years = [2015,2016,2017,2018,2019,2020];
//     let nyears = years;
//     let Tattr = Oattr;

//     ts.set_listener(() => {
//         nyears = years.filter(d => (d >= ts.start && d < ts.end));
//         Par.change_years(Data, nyears, Tattr);
//     });

//     ss.set_listener(() => {
//         Tattr = ss.choosen ? Dattr : Oattr;
//         init(Data, nyears, Tattr);
//     });

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
