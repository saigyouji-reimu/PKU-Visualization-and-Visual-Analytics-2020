import * as d3 from "d3";
import { getActualDim, getMinMax, boundValue } from "./utils";

const ATTR = "Season";

function TimeSpan(selector, data) {
  this.selector = selector;
  [this.width, this.height] = getActualDim(selector);
  [this.minv, this.maxv] = getMinMax(data, ATTR);
  this.maxv ++;
  this.start = this.minv;
  this.end = this.maxv;
  
  this.svg = d3
    .select(selector)
    .attr("viewBox", [0, 0, this.width, this.height]);
  this.initialized = false;
}

TimeSpan.prototype.draw_line = function () {
  const y = this.height / 2;
  const llx = this.width * 0.1;
  const lrx = this.width * 0.9;
  const line_data = [
    { x: llx, y: y },
    { x: lrx, y: y },
  ];
  let line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);
  this.svg
    .append("g")
    .append("path")
    .datum(line_data)
    .attr("stroke", "#bbb")
    .attr("stroke-width", 3)
    .style("opacity", "0.3")
    .attr("d", line);
  this.svg
    .append("g")
    .append("line")
    .attr("x1", llx)
    .attr("y1", y)
    .attr("x2", lrx)
    .attr("y2", y)
    .attr("stroke-width", 3)
    .attr("stroke", "#bbb");
};

TimeSpan.prototype.draw_circles = function () {
  const y = this.height / 2;
  const rad = this.height * 0.3;
  let lx =
    this.width *
    (0.1 + (0.8 * (this.start - this.minv)) / (this.maxv - this.minv));
  let rx =
    this.width *
    (0.1 + (0.8 * (this.end - this.minv)) / (this.maxv - this.minv));
  const circ_data = [
    { x: lx, y: y, r: rad, tag: 1 },
    { x: rx, y: y, r: rad, tag: 2 },
  ];
  let circles;
  if (!this.initialized) {
    circles = this.svg
      .append("g")
      .selectAll("circle")
      .data(circ_data)
      .join("circle")
      .attr("cx", (d, _) => d.x)
      .attr("cy", (d, _) => d.y)
      .attr("r", (d, _) => d.r)
      .attr("fill", "orange")
      .attr("stroke", "none");
    this.initialized = true;
  } else {
    circles = this.svg
      .selectAll("circle")
      .data(circ_data)
      .attr("cx", (d, _) => d.x)
      .attr("cy", (d, _) => d.y)
      .attr("r", (d, _) => d.r)
      .attr("fill", "orange")
      .attr("stroke", "none");
  }
  circles
    .on("mouseover", (_, d) => {
      circles.attr("fill", (f) =>
        f.tag == d.tag ? "yellow" : "orange"
      );
    })
    .on("mouseout", () => {
      circles.attr("fill", "orange");
    });
};

TimeSpan.prototype.update_dom = function (id) {
  let leaf = document.getElementById(id);
  leaf.innerText = `[${this.start}, ${this.end}]`;
  return;
};

TimeSpan.prototype.set_listener = function (updater) {
    this.svg.selectAll("circle").call(
    d3
      .drag()
      .on("drag", (e, d) => {
        const width = this.width;
        const mx = boundValue(e.x, 0.1 * width, 0.9 * width);
        if (d.tag == 1) {
          this.start = Math.round(
            this.minv + ((this.maxv - this.minv) * (mx / width - 0.1)) / 0.8
          );
          if (this.start >= this.end) this.start = this.end - 1;
          d3.select('line')
          .attr('x1', width *
          (0.1 + (0.8 * (this.start - this.minv)) / (this.maxv - this.minv)));
        } else {
          this.end = Math.round(
            this.minv + ((this.maxv - this.minv) * (mx / width - 0.1)) / 0.8
          );
          if (this.start >= this.end) this.end = this.start + 1;
          d3.select('line')
          .attr('x2', this.width *
          (0.1 + (0.8 * (this.end - this.minv)) / (this.maxv - this.minv)))
        }
        this.draw_circles();
        
        this.update_dom("range");
      })
      .on("end", (e, d) => {
        updater();
      })
  );
};

export { TimeSpan };
