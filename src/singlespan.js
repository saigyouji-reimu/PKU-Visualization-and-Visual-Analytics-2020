import * as d3 from 'd3';
import { TimeSpan } from './timespan';
import { getActualDim, getMinMax, boundValue } from './utils';

function SingleSpan(selector, range, flag) {
  this.selector = selector;
  [this.width, this.height] = getActualDim(selector);
  [this.minv, this.maxv] = range;
  this.start = this.minv;
  this.end = this.maxv;
  this.flag = flag;

  this.svg = d3
    .select(selector)
    .attr('viewBox', [0, 0, this.width, this.height]);
  this.initialized = false;
}

SingleSpan.prototype.draw_line = function () {
  let line_data;
  if (this.flag) {
    const x = this.width / 2;
    const luy = this.height * 0.1;
    const ldy = this.height * 0.9;
    line_data = [
      { x: x, y: luy },
      { x: x, y: ldy },
    ];
  } else {
    const y = this.height / 2;
    const llx = this.width * 0.1;
    const lry = this.width * 0.9;
    line_data = [
      { x: llx, y: y },
      { x: lrx, y: y },
    ];
  }

  let line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);

  this.svg
    .append('g')
    .append('path')
    .datum(line_data)
    .attr('stroke', '#bbb')
    .attr('stroke-width', 3)
    .style('opacity', 0.3)
    .attr('d', line);

  this.svg
    .append('g')
    .append('line')
    .attr('x1', line_data[0].x)
    .attr('y1', line_data[0].y)
    .attr('x2', line_data[1].x)
    .attr('y2', line_data[1].y);
};

SingleSpan.prototype.draw_circles = function () {
  let circ_Data;
  if (this.flag) {
    const x = this.width / 2;
    const rad = this.width * 0.3;
    let uy =
      this.height *
      (0.1 + (0.8 * (this.start - this.minv)) / (this.maxv - this.minv));
    circ_Data = [{ x: x, y: uy, r: rad, tag: 1 }];
  } else {
    const y = this.height / 2;
    const rad = this.height * 0.3;
    let uy =
      this.width *
      (0.1 + (0.8 * (this.start - this.minv)) / (this.maxv - this.minv));
    circ_Data = [{ x: x, y: uy, r: rad, tag: 1 }];
  }
  let circles;
  if (!this.initialized) {
    circles = this.svg
      .append('g')
      .selectAll('circle')
      .data(circ_Data)
      .join('circle')
      .attr('cx', (d, _) => d.x)
      .attr('cy', (d, _) => d.y)
      .attr('r', (d, _) => d.r)
      .attr('fill', 'orange')
      .attr('stroke', 'none');
    this.initialized = true;
  } else {
    circles = this.svg
      .selectAll('circle')
      .data(circ_Data)
      .attr('cx', (d, _) => d.x)
      .attr('cy', (d, _) => d.y)
      .attr('r', (d, _) => d.r)
      .attr('fill', 'orange')
      .attr('stroke', 'none');
  }
  circles
    .on('mouseover', (e, d) => {
      circles.attr('fill', (f) => (f.tag == d.tag ? 'yellow' : orange));
    })
    .on('mouseout', () => {
      circles.attr('fill', 'orange');
    });
};

SingleSpan.prototype.set_listener = function (updater) {
  this.svg.selectAll('circle').call(
    d3
      .drag()
      .on('drag', (e, d) => {
        const width = this.flag ? this.height : this.width;
        const mx = boundValue(this.flag ? e.y : e.x, 0.1 * width, 0.9 * width);

        this.start = Math.round(
          this.minv + ((this.maxv - this.minv) * (mx / width - 0.1)) / 0.8,
        );
        this.draw_circles();
      })
      .on('end', (e, d) => {
        updater();
      }),
  );
};

export { SingleSpan };
