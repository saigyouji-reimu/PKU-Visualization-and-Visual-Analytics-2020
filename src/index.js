import * as d3 from "d3";
import { TimeSpan } from "./timespan";
import { SingleSpan } from "./singlespan";
import { SingleButton } from "./singlebutton";
import { getActualDim, get_team } from "./utils";
import { Parallel } from "./Parallel";

let [_width, _height] = getActualDim('body');
let width = 0.9 * _width;
let height = 0.9 * _height;
let data_file = './data.json';

let svg;
let Par;

const Oattr = ["FGA", "FG%", "3PA", "3P%", "FTA", "PTS", "ORtg", "Home Win%"];
const Dattr = ["ORB", "DRB", "STL", "BLK", "PF", "DRtg", "Away Win%"];

function init(Data, years, attr){
    svg.remove();

    svg = d3.select('#team')
        .append('svg')
        .attr('id', 'Parallel')
        .attr('width', width)
        .attr('height', height)
        .attr("transform", "translate(" + 0 + "," + 0 + ")");
    
    Par = new Parallel('#Parallel');
    
    Par.draw(Data, years, attr);

    /*
        设置listener后，触发事件会把平行坐标轴的svg隐藏掉
        想要重新显示视图调用par.show();
    */
    Par.set_listener((d) => {
        //d3.select('text').text(d);
        d3.select('#s1')
            .style("visibility", "hidden");
        //把攻防选择条隐藏，调用问par.show()以后也要设置成visiable
    });
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
        .attr("transform", "translate(" + 300 + "," + -45 + ")");

    div.append('svg')
        .attr('id', 's1')
        .attr('width', 100)
        .attr('height', 24)
        .attr("transform", "translate(" + 300 + "," + -45 + ")");
    
    svg = div.append('svg')
        .attr('id', 'Parallel');

    let ts = new TimeSpan('#p1', Data);
    ts.draw_line();
    ts.draw_circles();

    let ss = new SingleButton('#s1', ['offence', 'defence']);
    ss.draw_rect();

    let years = [2015,2016,2017,2018,2019,2020];
    let nyears = years;
    let Tattr = Oattr;

    ts.set_listener(() => {
        nyears = years.filter(d => (d >= ts.start && d < ts.end));
        Par.change_years(Data, nyears, Tattr);
    });

    ss.set_listener(() => {
        Tattr = ss.choosen ? Dattr : Oattr;
        init(Data, nyears, Tattr);
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

