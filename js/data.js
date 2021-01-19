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
