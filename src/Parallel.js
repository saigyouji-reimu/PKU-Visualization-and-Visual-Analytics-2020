import * as d3 from "d3";
import { getActualDim, get_team } from "./utils";
import { kmeans } from "./data_process";
import { SingleSpan } from "./singlespan";

const show_attr = ["FGA", "FG%", "3PA", "3P%", "FTA", "FT%", "AST", "TOV", "PTS", "ORtg", "ORB", "DRB", "STL", "BLK", "PF", "DRtg", "Home Win%", "Away Win%"];
const color = [d3.rgb(228, 26, 28), d3.rgb(55, 126, 184), d3.rgb(77, 175, 74), d3.rgb(152, 78, 163), d3.rgb(255, 127, 0), d3.rgb(255, 255, 51), d3.rgb(166, 86, 40), d3.rgb(247, 129, 191)];

let width;
let height;

function get_min_max(data, attr) {
    let min = 1e9;
    let max = 0;
    
    data.forEach((d, i) => {
        let v = parseFloat(d[attr]);
        if (v > max)
            max = v;
        if (v < min)
            min = v;
    });
    
    //console.log('attr', attr, 'min', min, 'max', max);
    return [max, min];
}

let team = new Array();

let Scale = new Array();
let Axis = new Array();
let svg;

let LineGraph = new Array();
let RectGraph = new Array();
let TextGraph = new Array();
let block = new Array();

let dur = 1000;

function Parallel(selector){
    this.selector = selector;
    [width, height] = getActualDim(selector);
    svg = d3.select(selector);
}

Parallel.prototype.draw = function(data, years, attr){
    attr.forEach((d, i) => {
        Scale[i] = d3.scaleLinear()
            .domain(get_min_max(data, d))
            .range([0, height * 0.8]);
        
        Axis[i] = d3.axisLeft(Scale[i]).ticks(7);
    });
    data = data.filter((d, i) => (years.includes(d["Season"])));

    let ave_d = new Array(), ori_d = new Array();
    team = get_team(data);
    team.forEach((d, i) => {
        ave_d[i] = {};
        ori_d[i] = [];
        show_attr.forEach((a, j) => {
            ave_d[i][a] = 0;
            data.forEach(f => {
                if(f['Team'] == d) ave_d[i][a] += f[a];
            })
            ave_d[i][a] /= years.length;
            ave_d[i][a] = ave_d[i][a].toFixed(4);
            ori_d[i][j] = ave_d[i][a];
        });
    });

    let A = kmeans(ori_d, 7, 'team');
    
    let L = attr.length;
    let delta = width * 0.8 / L;
    let left = width * 0.04;
    let Left = width * 0.05;
    let dheight = height * 0.1;
   // svg.remove();
    
    
    svg.selectAll("text")
        .data(attr)
        .enter()
        .append("text")
        .attr("transform", function (d, i) {
            return "translate(" + left + "," + (dheight - height * 0.05) + ")";
        })
        .attr("fill", 'black')
        .attr("font-size", 15)
        .text(function (d, i) {
            return attr[i];
        })
        .transition()
        .duration(dur)
        .attr("transform", function (d, i) {
            return "translate(" + (left + delta * i) + "," + (dheight - 0.05 * height) + ")";
        });

    let Line = d3.line()
    .x(function (d) {
        return d.x;
    })
    .y(function (d) {
        return d.y;
    });

    attr.forEach((d, i) => {
        svg.append("g")
            .attr("transform", "translate(" + Left + "," + (dheight) + ")")
            .call(Axis[i])
            .transition()
            .duration(dur)
            .attr("font-size", 12)
            .attr("transform", "translate(" + (Left + delta * i) + "," + (dheight) + ")");
    });

    team.forEach((d, i) => {
        let Linedata = new Array();
        let LineData = new Array();
        
        attr.forEach((a, j) => {
            Linedata[j] = {"x": (Left), "y": (dheight) + Scale[j](ave_d[i][a])};
            LineData[j] = {"x": (Left + delta * j), "y": (dheight) + Scale[j](ave_d[i][a])};
        })

        let Text;
        function show_up(){
            Text = svg.append('text')
                .text(d)
                .attr("transform", "translate(" + LineData[L - 1].x + "," + LineData[L - 1].y + ")");

            LineGraph[i].attr('opacity', 0.9)
                .attr("stroke-width", 9);
        
            let content = '<table><tr><td>' + d + '</td></tr>';
            show_attr.forEach((dd, i) => {
                content = content + '<tr><td>' + dd + '</td><td>' + ave_d[i][dd] + '</td></tr>';
            });
            content = content + '</table>';

            // tooltip
            let tooltip = d3.select('#tooltip');            
            tooltip.html(content)
                .style('left', width*0.91 + 'px')
                .style('top', height*0.15 + 'px')
                //.transition().duration(500)
                .style('visibility', 'visible');
        }

        function show_down(){
            Text.remove();
            LineGraph[i].attr('opacity', 0.2)
                .attr("stroke-width", 4);  
            let tooltip = d3.select('#tooltip');
            tooltip.style('visibility', 'hidden');
        }

        LineGraph[i] = svg.append("path")
            .attr("d", Line(Linedata))
            .attr('stroke', color[A[i]])
            .attr("stroke-width", 4)
            .attr('fill', 'none')
            .attr('opacity', 0.2)
            .attr('id', d)
            .attr('class', A[i])
            .on('mouseover', (e, _d) => {
                show_up();
            })
            .on('mouseout', (e, d) => {
                show_down();
            });
        
        LineGraph[i].transition()
            .duration(dur)
            .attr("d", Line(LineData));
        
        block[i] = svg.append("g")
            .attr("transform", "translate(" + (width * 0.83) + "," + dheight + ")")
            .on('mouseover', (e, _d) => {
                RectGraph.forEach((d, j) => {
                    if(A[j] == A[i]){
                        RectGraph[j].attr("stroke-width", 2);
                        LineGraph[j].attr('opacity', 0.5)
                            .attr("stroke-width", 6);
                    }
                })
                show_up();
            })
            .on('mouseout', (e, d) => {
                show_down();
                RectGraph.forEach((d, j) => {
                    RectGraph[j].attr("stroke-width", 0);
                    LineGraph[j].attr('opacity', 0.2)
                        .attr("stroke-width", 4);  
                })
            })
        
        RectGraph[i] = block[i].append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", color[A[i]])
            .attr("stroke", "black")
            .attr("stroke-width", 0);
        
        TextGraph[i] = block[i].append("text")
            .attr("x", 30)
            .attr("y", 15)
            .text(d)
        
        block[i].transition()
            .duration(dur)
            .attr("transform", "translate(" + (width * 0.83) + "," + (dheight + i * 20) + ")")
    });
    /*svg.selectAll('text')
        .data(team)*/
    
}

Parallel.prototype.change_years = function(data, years, attr){
    data = data.filter((d, i) => (years.includes(d["Season"])));
    let ave_d = new Array(), ori_d = new Array();
    team.forEach((d, i) => {
        ave_d[i] = {};
        ori_d[i] = [];
        show_attr.forEach((a, j) => {
            ave_d[i][a] = 0;
            data.forEach(f => {
                if(f['Team'] == d) ave_d[i][a] += f[a];
            })
            ave_d[i][a] /= years.length;
            ave_d[i][a] = ave_d[i][a].toFixed(4);
            ori_d[i][j] = ave_d[i][a];
        });
    });

    let A = kmeans(ori_d, 7, 'team');
    
    let L = attr.length;
    let delta = width * 0.8 / L;
    let left = width * 0.04;
    let Left = width * 0.05;
    let dheight = height * 0.1;

    let Line = d3.line()
    .x(function (d) {
        return d.x;
    })
    .y(function (d) {
        return d.y;
    });

    team.forEach((d, i) => {
        let LineData = new Array();
        attr.forEach((a, j) => {
            LineData[j] = {"x": (Left + delta * j), "y": (dheight) + Scale[j](ave_d[i][a])};
        })
        function show_up(){
            Text = svg.append('text')
                .text(d)
                .attr("transform", "translate(" + LineData[L - 1].x + "," + LineData[L - 1].y + ")");

            LineGraph[i].attr('opacity', 0.9)
                .attr("stroke-width", 9);
        
            let content = '<table><tr><td>' + d + '</td></tr>';
            show_attr.forEach((dd, i) => {
                content = content + '<tr><td>' + dd + '</td><td>' + ave_d[i][dd] + '</td></tr>';
            });
            content = content + '</table>';

            // tooltip
            let tooltip = d3.select('#tooltip');            
            tooltip.html(content)
                .style('left', width*0.91 + 'px')
                .style('top', height*0.15 + 'px')
                //.transition().duration(500)
                .style('visibility', 'visible');
        }

        function show_down(){
            Text.remove();
            LineGraph[i].attr('opacity', 0.2)
                .attr("stroke-width", 4);  
            let tooltip = d3.select('#tooltip');
            tooltip.style('visibility', 'hidden');
        }

        LineGraph[i].on('mouseover', (e, _d) => {
                show_up();
            })
            .on('mouseout', (e, d) => {
                show_down();
            })
            .transition()
            .duration(dur)
            .attr("d", Line(LineData))
            .transition()
            .duration(dur)
            .attr("stroke", color[A[i]]);

        RectGraph[i].transition()
            .duration(dur)
            .attr('fill', color[A[i]]);

        block[i].on('mouseover', (e, _d) => {
                RectGraph.forEach((d, j) => {
                    if(A[j] == A[i]){
                        RectGraph[j].attr("stroke-width", 2);
                        LineGraph[j].attr('opacity', 0.5)
                            .attr("stroke-width", 6);
                    }
                })
                show_up();
            })
            .on('mouseout', (e, d) => {
                show_down();
                RectGraph.forEach((d, j) => {
                    RectGraph[j].attr("stroke-width", 0);
                    LineGraph[j].attr('opacity', 0.2)
                        .attr("stroke-width", 4);  
                })
            })
    });
    d3.select('text').text('flag');
}

Parallel.prototype.disappear = function(){
    svg.style("visibility", "hidden");
}

Parallel.prototype.show = function(){
    svg.style("visibility", "visible");
}

Parallel.prototype.set_listener = function (updater){
    block.forEach((d, i) => {
        d.on('click', (e, f) => {
            this.disappear();
            updater(team[i]);
        })
    })
}

export { Parallel };