import * as d3 from "d3";
import { getActualDim } from "./utils"

let data = null;
let data_file = './data/data.csv';
let x_choiceItem = '<option value="FGA " selected="selected">FGA</option>'
    + '<option value="FG% ">FG%</option>'
    + '<option value="3P ">3P</option>'
    + '<option value="3PA ">3PA</option>'
    + '<option value="FTM ">FTM</option>'
    + '<option value="FTA ">FTA</option>'
    + '<option value="FT% ">FT%</option>'
    + '<option value="ORB ">ORB</option>'
    + '<option value="DRB ">DRB</option>'
    + '<option value="TRB ">TRB</option>'
    + '<option value="AST ">AST</option>'
    + '<option value="STL ">STL</option>'
    + '<option value="BLK ">BLK</option>'
    + '<option value="TOV ">TOV</option>'
    + '<option value="PF ">PF</option>'
    + '<option value="+/- ">+/-</option>'
    + '<option value="TS% ">TS%</option>'
    + '<option value="eFG% ">eFG%</option>'
    + '<option value="3PAr ">3PAr</option>'
    + '<option value="ORtg ">ORtg</option>'
    + '<option value="DRtg ">DRtg</option>'
let y_choiceItem = '<option value="FGA ">FGA</option>'
    + '<option value="FG% "  selected="selected">FG%</option>'
    + '<option value="3P ">3P</option>'
    + '<option value="3PA ">3PA</option>'
    + '<option value="FTM ">FTM</option>'
    + '<option value="FTA ">FTA</option>'
    + '<option value="FT% ">FT%</option>'
    + '<option value="ORB ">ORB</option>'
    + '<option value="DRB ">DRB</option>'
    + '<option value="TRB ">TRB</option>'
    + '<option value="AST ">AST</option>'
    + '<option value="STL ">STL</option>'
    + '<option value="BLK ">BLK</option>'
    + '<option value="TOV ">TOV</option>'
    + '<option value="PF ">PF</option>'
    + '<option value="+/- ">+/-</option>'
    + '<option value="TS% ">TS%</option>'
    + '<option value="eFG% ">eFG%</option>'
    + '<option value="3PAr ">3PAr</option>'
    + '<option value="ORtg ">ORtg</option>'
    + '<option value="DRtg ">DRtg</option>'
let year_choiceItem = '<option value="2015">2015</option>'
    + '<option value="2016" >2016</option>'
    + '<option value="2017" selected="selected">2017</option>'
    + '<option value="2018">2018</option>'
    + '<option value="2019">2019</option>'
    + '<option value="2020">2020</option>'
function get_min_max(data, attr) {
    let min = 1e9;
    let max = 0;
    data.forEach(d => {
        let v = parseInt(d[attr]);
        if (v > max)
            max = v+1;
        if (v < min)
            min = v;
    });

    return [min, max];
}


let [width, height] = getActualDim('#container');  // 0.9
let x_attr = 'FGA ';
let y_attr = 'FG% ';
let year = '2015';
let fontFamily;

function set_ui() {

    let ua = navigator.userAgent.toLowerCase();
    fontFamily = "Khand-Regular";
    if (/\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua)) {
        fontFamily = "PingFangSC-Regular";
    }
    d3.select("#player")
        .style("font-family", fontFamily);
}

function changeX(val) {
    x_attr = val;
    d3.select('svg').remove();
    d3.select('#container')
        .append('svg')
    draw_main();
}

//当用下拉表单改变y轴时发生的行为
function changeY(val) {
    y_attr = val;
    d3.select('svg').remove();
    d3.select('#container')
        .append('svg')
    draw_main();
}

function changeT(val) {
    year = val;
    d3.select('svg').remove();
    d3.select('#container')
        .append('svg')
    draw_main();
}

function draw_selections() {
    //add x axis selections:
    d3.select('#container2')
        .append('label')
        .attr('id', 'xname')
        .text('X_direction:')
    let x_choice = d3.select('#container')
        .append('select')
        .attr('id', 'xItem')
        .on('change', (e, d) => {
            changeX(document.querySelector("#xItem").value);
        })
        .html(x_choiceItem)
    //add y axis selections:
    d3.select('#container2')
        .append('label')
        .attr('id', 'yname')
        .text('Y_direction:')
    let y_choice = d3.select('#container')
        .append('select')
        .attr('id', 'yItem')
        .on('change', (e, d) => {
            changeY(document.querySelector("#yItem").value);
        })
        .html(y_choiceItem)
    //add r axis selections:
    d3.select('#container2')
        .append('label')
        .attr('id', 'tname')
        .text('Year:')
    let t_choice = d3.select('#container')
        .append('select')
        .attr('id', 'tItem')
        .on('change', (e, d) => {
            changeT(document.querySelector("#tItem").value);
        })
        .html(year_choiceItem)
}


function draw_main() {
    let padding = { 'left': 0.2 * width, 'bottom': 0.1 * height, 'top': 0.2 * height, 'right': 0.1 * width };
    let svg = d3.select('#container')
        .select('svg')
        .attr('width', width)
        .attr('height', height);

    svg.append('g')
        .attr('transform', `translate(${padding.left + (width - padding.left - padding.right) / 2}, ${padding.top * 0.4})`)
        .append('text')
        .attr('class', 'title')
        .text('A Visualization for NBA Player');


    let x = d3.scaleLinear()
        .domain(get_min_max(data, x_attr + year))
        .range([padding.left, width - padding.right]);
    let axis_x = d3.axisBottom()
        .scale(x)
        .ticks(10)
        .tickFormat(d => d);


    let y = d3.scaleLinear()
        .domain(get_min_max(data, y_attr + year))
        .range([height - padding.bottom, padding.top]);
    let axis_y = d3.axisLeft()
        .scale(y)
        .ticks(10)
        .tickFormat(d => d);


    svg.append('g')
        .attr('transform', `translate(${0}, ${height - padding.bottom})`)
        .call(axis_x)
        .attr('font-family', fontFamily)
        .attr('font-size', '0.8rem')

    svg.append('g')
        .attr('transform', `translate(${padding.left + (width - padding.left - padding.right) / 2}, ${height - padding.bottom})`)
        .append('text')
        .attr('class', 'axis_label')
        .attr('dx', '-0.4rem')
        .attr('dy', 0.08 * height)
        .text(x_attr + year);


    svg.append('g')
        .attr('transform', `translate(${padding.left}, ${0})`)
        .call(axis_y)
        .attr('font-family', fontFamily)
        .attr('font-size', '0.8rem')
    svg.append('g')
        .attr('transform', `
            translate(${padding.left}, ${height / 2})
            rotate(-90)    
        `)
        .append('text')
        .attr('class', 'axis_label')
        .attr('dy', -height * 0.07)
        .text(y_attr + year);

    svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('class', 'point')
        .attr('cx', (d, i) => {

            return x(parseFloat(d[x_attr + year]));
        })
        .attr('cy', (d, i) => y(parseFloat(d[y_attr + year])))
        .attr('r', 3)
        .style('fill', function (d) {
            if (parseInt(d['ORtg '+year])>110 ) {
                return "red";
            } else if (parseInt(d['ORtg '+year]) > 100 && parseInt(d['ORtg '+year])<=110) {
                return "orange";
            }
            else if (parseInt(d['ORtg ' + year]) > 90 && parseInt(d['ORtg ' + year]) <= 100) {
                return "yellow";
            }
            else if (parseInt(d['ORtg ' + year]) > 80 && parseInt(d['ORtg ' + year]) <= 90) {
                return "pink";
            }
            return "blue";
        })
        .on('mouseover', (e, d) => {

            //console.log('e', e, 'd', d)

            // show a tooltip
            let Player = d['Player'];
            let FGr = d['FG% ' + year];
            let Pr = d['3P% ' + year];
            let FTr = d['FT% ' + year];
            let TRB = d['TRB ' + year];
            let AST = d['AST ' + year];
            let PF = d['PF ' + year];
            let PTS = d['PTS ' + year];
            let ORtg = d['ORtg ' + year];
            let DRtg = d['DRtg ' + year];


            //console.log('data', d);


            let content = '<table><tr><td>Name</td><td>' + Player + '</td></tr>'
                + '<tr><td>FG%</td><td>' + FGr + '</td></tr>'
                + '<tr><td>3P%</td><td>' + Pr + '</td></tr>'
                + '<tr><td>FT%</td><td>' + FTr + '</td></tr>'
                + '<tr><td>TRB</td><td>' + TRB + '</td></tr>'
                + '<tr><td>AST</td></td><td>' + AST + '</td></tr>'
                + '<tr><td>PF</td></td><td>' + PF + '</td></tr>'
                + '<tr><td>PTS</td></td><td>' + PTS + '</td></tr>'
                + '<tr><td>ORtg</td></td><td>' + ORtg + '</td></tr>'
                + '<tr><td>DRtg</td></td><td>' + DRtg + '</td></tr>';

            // tooltip
            let tooltip = d3.select('#tooltip');
            tooltip.html(content)
                .style('left', (x(parseFloat(d[x_attr + year])) + 5) + 'px')
                .style('top', (y(parseFloat(d[y_attr + year])) + 5) + 'px')
                //.transition().duration(500)
                .style('visibility', 'visible');
            let p1 = parseFloat(d['FG% ' + year]);
            if (isNaN(parseFloat(d['FG% ' + year]))) p1 = 0;
            let p2 = parseFloat(d['3P% ' + year]);
            if (isNaN(parseFloat(d['3P% ' + year]))) p2 = 0;
            let p3 = parseFloat(d['FT% ' + year]);
            if (isNaN(parseFloat(d['FT% ' + year]))) p3 = 0;
            let p4 = parseFloat(d['TS% ' + year]);
            if (isNaN(parseFloat(d['TS% ' + year]))) p4 = 0;
            let p5 = parseFloat(d['eFG% ' + year]);
            if (isNaN(parseFloat(d['eFG% ' + year]))) p5 = 0;
            let p6 = parseFloat(d['ORtg ' + year]) / 150;
            if (isNaN(parseFloat(d['ORtg ' + year]))) p6 = 0;
            radar(p1, p2, p3, p4, p5, p6);

        })
        .on('mouseout', (e, d) => {

            // remove tooltip
            let tooltip = d3.select('#tooltip');
            tooltip.style('visibility', 'hidden');
        })
}

            
function radar(a1, a2, a3, a4, a5, a6) {
   
    var width1 = 300, height1 = 300;
    // 创建一个分组用来组合要画的图表元素
    let main1 = d3.select('#container3')
        .select('svg')
        .attr('width', width1)
        .attr('height', height1)
        .classed('main1', true)
        .attr('transform', "translate(" + width1 / 2 + ',' + height1 / 2 + ')');
    var data1 = {
        fieldNames: ['FG%', '3P%', 'FT%', 'TS%', 'eFG%', 'ORtg'],
        values: [
            [a1, a2, a3, a4, a5, a6]
        ]
    };
    var radius = 100,
        // 指标的个数，即fieldNames的长度
        total = 6,
        // 需要将网轴分成几级，即网轴上从小到大有多少个正多边形
        level = 5,
        // 网轴的范围，类似坐标轴
        rangeMin = 0,
        rangeMax = 1,
        arc = 2 * Math.PI;
    // 每项指标所在的角度
    var onePiece = arc / total;
    // 计算网轴的正多边形的坐标
    var polygons = {
        webs: [],
        webPoints: []
    };
    for (var k = level; k > 0; k--) {
        var webs = '',
            webPoints = [];
        var r = radius / level * k;
        for (var i = 0; i < total; i++) {
            var x = r * Math.sin(i * onePiece) + 0.5 * width1,
                y = r * Math.cos(i * onePiece) + 0.5 * height1;
            webs += x + ',' + y + ' ';
            webPoints.push({
                x: x,
                y: y
            });
        }
        polygons.webs.push(webs);
        polygons.webPoints.push(webPoints);
    }
    // 绘制网轴
    var webs = main1.append('g')
        .classed('webs', true);
    webs.selectAll('polygon')
        .data(polygons.webs)
        .enter()
        .append('polygon')
        .attr('points', function (d) {
            return d;
        })
        .style("fill-opacity", 0.5)
        .style("stroke", 'gray')
        .style("stroke - dasharray", 10, 5);
    // 添加纵轴
    var lines = main1.append('g')
        .classed('lines', true);
    lines.selectAll('line')
        .data(polygons.webPoints[0])
        .enter()
        .append('line')
        .attr('x1', 0.5 * width1)
        .attr('y1', 0.5 * height1)
        .attr('x2', function (d) {
            return d.x;
        })
        .attr('y2', function (d) {
            return d.y;
        })
        .style("stroke", 'black');

    // 计算雷达图表的坐标
    var areasData = [];
    var values = data1.values;
    for (var i = 0; i < values.length; i++) {
        var value = values[i],
            area = '',
            points = [];
        for (var k = 0; k < total; k++) {
            var r = radius * (value[k] - rangeMin) / (rangeMax - rangeMin);
            var x = r * Math.sin(k * onePiece) + 0.5 * width1,
            y = r * Math.cos(k * onePiece) + 0.5 * height1;
            area += x + ',' + y + ' ';
            points.push({
                x: x,
                y: y
            })
        }
        areasData.push({
            polygon: area,
            points: points
        });
    }
    // 添加g分组包含所有雷达图区域
    var areas = main1.append('g')
        .classed('areas', true);
    // 添加g分组用来包含一个雷达图区域下的多边形以及圆点 
    areas.selectAll('g')
        .data(areasData)
        .enter()
        .append('g')
        .attr('class', function (d, i) {
            return 'area' + (i + 1);
        });
    for (var i = 0; i < areasData.length; i++) {
        // 依次循环每个雷达图区域
        var area = areas.select('.area' + (i + 1)),
            areaData = areasData[i];
        // 绘制雷达图区域下的多边形
        area.append('polygon')
            .attr('points', areaData.polygon)
            .attr('stroke', function (d, index) {
                return getColor(i);
            })
            .attr('fill', function (d, index) {
                return getColor(i);
            })
            .style("fill-opacity", 0.3)
            .style("stroke - width", 3);

        // 绘制雷达图区域下的点 
        var circles = area.append('g')
            .classed('circles', true);
        circles.selectAll('circle')
            .data(areaData.points)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            })
            .attr('r', 3)
            .attr('stroke', function (d, index) {
                return getColor(i);
            })
            .style("fill", 'white')
            .style("stroke - width", 3);
    }
    var textPoints = [];
    var textRadius = radius + 20;
    for (var i = 0; i < total; i++) {
        var x = textRadius * Math.sin(i * onePiece) + 0.5 * width1,
            y = textRadius * Math.cos(i * onePiece) + 0.5 * height1;
        textPoints.push({
            x: x,
            y: y
        });
    }
    var texts = main1.append('g')
        .classed('texts', true);
    texts.selectAll('text')
        .data(textPoints)
        .enter()
        .append('text')
        .attr('x', function (d) {
            return d.x;
        })
        .attr('y', function (d) {
            return d.y;
        })
        .text(function (d, i) {
            return data1.fieldNames[i];
        });
}
function getColor(idx) {
    var palette = [
        '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
        '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
        '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
        '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
    ]
    return palette[idx % palette.length];
}
function main() {
    
    d3.csv(data_file).then(function (DATA) {
        
        d3.select('header').text('flag');
        data = DATA;
        data = data.filter((d, i) => (d[x_attr + year] != '' && d[y_attr + year] != ''));
        set_ui();
        draw_main();
        draw_selections();
    })
}

export { main };
