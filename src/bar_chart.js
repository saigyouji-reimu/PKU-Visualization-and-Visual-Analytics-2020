import * as d3 from 'd3';
import { getActualDim } from './utils';

const margin = { top: 20, right: 0, bottom: 30, left: 40 };
const base_color = 'steelblue';
const invalid_color = 'gray';
const durat = 800;

function getTransition() {
  return d3.transition().duration(durat);
}

function BarChart(selector) {
  this.selector = selector;
  [this.width, this.height] = getActualDim(selector);
  this.svg = d3
    .select(selector)
    .attr('viewBox', [0, 0, this.width, this.height]);
}

BarChart.prototype.gen_data = function (team_data, team_name, attrs) {
  const ATTRP = 'Team';
  const ATTRS = 'Season';
  let ret = [];
  let N = 0.0;
  let sumd = {};
  for (const attr of attrs) {
    sumd[attr] = 0.0;
  }
  for (const d of team_data) {
    if (d[ATTRP] !== team_name) continue;
    for (const attr of attrs) {
      sumd[attr] += d[attr];
      ret.push({ name: attr, value: d[attr], season: d[ATTRS] });
    }
    N += 1.0;
  }
  ret.forEach((d) => {
    d.value = (d.value * N) / sumd[d.name]; // normalization
  });
  return ret;
};

BarChart.prototype.draw = function (data, seasons) {
  const [width, height] = [this.width, this.height];
  const svg = this.svg;
  svg.selectAll('g').remove();

  let y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);
  let x = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1);
  let yAxis = (g) =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select('.domain').remove());
  let xAxis = (g) =>
    g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
  svg.append('g').attr('class', 'x-axis').call(xAxis);
  svg.append('g').attr('class', 'y-axis').call(yAxis);
  let rect = svg.append('g').attr('class', 'bars').selectAll('rect');

  function update_chart(data, season) {
    const new_data = data.filter((d) => d.season === season);
    rect = rect
      .data(new_data, (d) => d.value)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('fill', base_color)
            .attr('x', (d) => x(d.name) + x.bandwidth() - 5)
            .attr('y', (d) => y(d.value))
            .attr('width', 0)
            .attr('height', (d) => y(0) - y(d.value)),
        (update) => update,
        (exit) =>
          exit.attr('fill', invalid_color).call((exit) =>
            exit
              .transition(getTransition())
              .attr('width', (d) => 0)
              .remove(),
          ),
      );
    console.log(rect);
    rect
      .transition(getTransition())
      .attr('x', (d) => x(d.name) + 5)
      .attr('width', (d) => x.bandwidth() - 10);
  }

  let i = 1.0;
  for (const s of seasons) {
    setTimeout(() => update_chart(data, s), durat * i);
    i += 1.0;
  }
};

export { BarChart };
