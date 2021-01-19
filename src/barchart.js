import * as d3 from 'd3';
import { getActualDim } from './utils';

function BarChart(selector, props) {
  this.selector = selector;
  this.svg = d3.select(selector);
  [this.width, this.height] = getActualDim(selector);
}