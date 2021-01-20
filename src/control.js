import * as d3 from "d3";
import { main } from "./main";
import { pmain } from "./index_";
import { SingleButton } from "./singlebutton";

main();
pmain();

let player = d3.select('#playerframe');
let team = d3.select('#team');

team.style('visibility', "hidden");

d3.select('#mode')
    .attr('width', 100)
    .attr('height', 24)
    .attr("transform", "translate(" + 0 + "," + -31 + ")");
let mode = new SingleButton('#mode', ['player', 'team']);
mode.draw_rect();
mode.set_listener(() => {
    if(mode.choosen){
        team.style('visibility', "visible");
        player.style('visibility', "hidden");
    }
    else {
        player.style('visibility', "visible");
        team.style('visibility', "hidden");
    }
})
