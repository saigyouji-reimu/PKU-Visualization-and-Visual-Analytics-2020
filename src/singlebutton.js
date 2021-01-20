import * as d3 from "d3";
import { getActualDim, getMinMax, boundValue } from "./utils";

function SingleButton(selector, range){
    this.selector = selector;
    [this.width, this.height] = getActualDim(selector);
    this.range = range;
    this.choosen = 0;

    this.svg = d3.select(selector)
        .attr("viewBox", [0, 0, this.width, this.height]);
    this.initialized = false;
}

SingleButton.prototype.draw_rect = function () {
    this.b = this.svg.append('g')
        .attr("transform", "translate(" + 0 + "," + 0 + ")");

    this.r = this.b.append('rect')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('fill', 'yellow')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    this.t = this.b.append('text')
        .attr("transform", "translate(" + 5 + "," + 15 + ")")
        .text('show ' + this.range[this.choosen ^ 1]);
}

SingleButton.prototype.set_listener = function(updater) {
    this.b.on('click', (e, d) => {
        this.choosen ^= 1;
        this.r.attr('fill', this.choosen ? 'orange' : 'yellow');
        this.t.text('show ' + this.range[this.choosen ^ 1]);
        updater();
    });
}

export { SingleButton };