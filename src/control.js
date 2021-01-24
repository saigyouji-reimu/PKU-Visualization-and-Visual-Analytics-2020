import * as d3 from 'd3';
import { main } from './main';
import { pmain } from './index_';
import { SingleButton } from './singlebutton';
import { getActualDim } from "./utils";

let [width, height] = getActualDim('body');

main();
pmain();

let player = d3.select('#playerframe');
let team = d3.select('#team');

team.style('visibility', 'hidden');

d3.select('#mode')
  .attr('width', 0.05 * width)
  .attr('height', 0.03 * height)
  .attr('transform', 'translate(' + 0 + ',' + 0.005 * height + ')');
let mode = new SingleButton('#mode', ['player', 'team']);
mode.draw_rect();
mode.set_listener(() => {
  if (mode.choosen) {
    team.style('visibility', 'visible');
    player.style('visibility', 'hidden');
  } else {
    player.style('visibility', 'visible');
    team.style('visibility', 'hidden');
  }
});
