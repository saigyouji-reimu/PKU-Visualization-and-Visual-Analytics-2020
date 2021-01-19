import * as d3 from "d3";
import { TimeSpan } from "./timespan";
import { getActualDim, get_team } from "./utils";
import { kmeans } from "./data_process";

let [_width, _height] = getActualDim('body');
let width = 0.9 * _width;
let height = 0.9 * _height;
let data_file = './data.json';

let svg;

const Oattr = ["FGA", "FG%", "3PA", "3P%", "FTA", "PTS", "ORtg", "Home Win%"];
const Dattr = ["ORB", "DRB", "STL", "BLK", "PF", "DRtg", "Away Win%"];
const show_attr = ["FGA", "FG%", "3PA", "3P%", "FTA", "FT%", "AST", "TOV", "PTS", "ORtg", "ORB", "DRB", "STL", "BLK", "PF", "DRtg", "Home Win%", "Away Win%"]
const color = [d3.rgb(228, 26, 28), d3.rgb(55, 126, 184), d3.rgb(77, 175, 74), d3.rgb(152, 78, 163), d3.rgb(255, 127, 0), d3.rgb(255, 255, 51), d3.rgb(166, 86, 40), d3.rgb(247, 129, 191)];
let team = new Array();

let Scale = new Array();
let Axis = new Array();

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

function draw(data, years, attr){

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

    let A = kmeans(ori_d, 8, 'team');
    d3.select('text').text(A.length);
    
    attr.forEach((d, i) => {
        Scale[i] = d3.scaleLinear()
            .domain(get_min_max(ave_d, d))
            .range([0, height * 0.8]);
        
        Axis[i] = d3.axisLeft(Scale[i]).ticks(7);
    });
    
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
        .duration(1000)
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

    //d3.select('text').text(data[2].Team);

    Axis.forEach((d, i) => {
        svg.append("g")
            .attr("transform", "translate(" + Left + "," + (dheight) + ")")
            .call(Axis[i])
            .transition()
            .duration(1000)
            .attr("font-size", 12)
            .attr("transform", "translate(" + (Left + delta * i) + "," + (dheight) + ")");
    });

    let LineGraph = new Array();
    let RectGraph = new Array();
    let TextGraph = new Array();

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
                .attr("stroke-width", 10);
        
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
                .attr("stroke-width", 6);  
            let tooltip = d3.select('#tooltip');
            tooltip.style('visibility', 'hidden');
        }

        LineGraph[i] = svg.append("path")
            .attr("d", Line(Linedata))
            .attr('stroke', color[A[i]])
            .attr("stroke-width", 6)
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
            .duration(1000)
            .attr("d", Line(LineData));

        let block = svg.append("g")
            .attr("transform", "translate(" + 1420 + "," + 110 + ")")
            .on('mouseover', (e, _d) => {
                RectGraph.forEach((d, j) => {
                    if(A[j] == A[i]){
                        RectGraph[j].attr("stroke-width", 2);
                        LineGraph[j].attr('opacity', 0.5)
                            .attr("stroke-width", 7);
                    }
                })
                show_up();
            })
            .on('mouseout', (e, d) => {
                show_down();
                RectGraph.forEach((d, j) => {
                    RectGraph[j].attr("stroke-width", 0);
                    LineGraph[j].attr('opacity', 0.2)
                        .attr("stroke-width", 6);  
                })
            })
            .on('click', (e, d) => {
                d3.select('#team').remove();
                d3.select('body')
                    .append('div')
                    .attr('id', 'team');
                d3.select('#tooltip')
                    .style('visibility', "hidden");

                

                /* 重置div team，之后调用第二个视图 */










            });
        
        RectGraph[i] = block.append("rect")
            .attr("x", 0)
            .attr("y", dheight - height * 0.15)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", color[A[i]])
            .attr("stroke", "black")
            .attr("stroke-width", 0);
        
        RectGraph[i].transition()
            .duration(1000)
            .attr("y", dheight - height * 0.15 + i * 20);
        
        TextGraph[i] = block.append("text")
            .attr("x", 30)
            .attr("y", dheight - height * 0.15 + 15)
            .text(d)
        
        TextGraph[i].transition()
            .duration(1000)
            .attr("y", dheight - height * 0.15 + 15 + i * 20);
    });
        
        
    
    /*svg.selectAll('text')
        .data(team)*/
        
}

function init(Data, years, attr){
    svg.remove();

    svg = d3.select('#team')
        .append('svg')
        .attr('id', 'Parallel')
        .attr('width', width)
        .attr('height', height)
        .attr("transform", "translate(" + 0 + "," + -150 + ")");
    Data = Data.filter((d, i) => (years.includes(d["Season"])));
    //d3.select('text').text(Data.length);
    
    draw(Data, years, attr);
}

function initial(Data){
    
    let div = d3.select('#team');
    div.append('p')
        .attr('id', 'Range')
        .attr('class', 'label')
        .text('Range Selected: ')
        .append('span')
        .attr('id', "range")
        .text('[2015, 2021]');

    div.append('svg')
        .attr('id', 'p1')
        .attr('height', 24)
        .attr('width', 500)
        .attr("transform", "translate(" + 300 + "," + -170 + ")");

    svg = div.append('svg')
        .attr('id', 'Parallel');
    
    div.append('svg')
        .attr('id', 's1')
        .attr('width', 24)
        .attr("transform", "translate(" + 0.8 * width + "," + 110 + ")");

    let ts = new TimeSpan('#p1', Data);
    ts.draw_line();
    ts.draw_circles();
    let years = [2015,2016,2017,2018,2019,2020];
    let nyears = new Array();
    team = get_team(Data);
    ts.set_listener(() => {
        nyears = years.filter(d => (d >= ts.start && d <= ts.end));
        init(Data, nyears, Oattr);
    });

    init(Data, years, Oattr);
}

function main(){
    d3.json(data_file).then(function(DATA){
        let Data = DATA;
        initial(Data);
        //init(Data, [2015], Oattr);
    });
}

main();

export { main }

