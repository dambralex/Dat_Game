canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.addEventListener('click',main,true);

map = {
    grid: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    pixel : 10
};

player = {
    x : 0,
    y : 0,
    w : map.pixel,
    h : map.pixel,

    color : "#FF0000",

    draw_player: function()
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.w,this.h);
    },

    update_player : function (s)
    {
        this.x = s.x;
        this.y = s.y;
    }
};

function draw_map(s)
{
    for(var i=0; i<10; i++)
    {
        for(var j=0; j<10;j++)
        {
            if(map.grid[i][j] === 0)
                ctx.fillStyle="#FFFFFF";
            else
            {
                ctx.fillStyle="#000000";
            }
            ctx.fillRect(i * map.pixel,j*map.pixel,map.pixel,map.pixel)
        }
    }
    if(s !== null)
        player.update_player(s);

    player.draw_player();
}

open = [];
closed_list = [];
path = [];

function Node (x, y, parent, dest)
{
    this.x = x;
    this.y = y;
    this.parent = parent;
    if(parent !== null)
        this.g = parent.g + 10;
    else
        this.g = 0;
    if(dest !== null)
        this.h= Math.abs(dest.x-x) + Math.abs(dest.y-y);
    this.f= this.g + this.h;
}

function distance (s, x, y) {
    return Math.sqrt((s.x - x)*(s.y - y)*(s.y - y));
}

function is_already_present (s, list){
    for(var i=0; i<list.length; i++)
        if(list[i].x === s.x && list[i].y === s.y) return i;

    return -1;
}

function add_to_closed_list (n){
    var i = is_already_present(n, open);
    closed_list.push(n);
    if(i >= 0)
        open.splice(i,1);
}

function add_neighbours (s){
    for(var i=s.x - 10; i <=s.x+10; i+=10)
    {
        if((i<0) || (i>=100)) continue;
        for(var j=s.y - 10; j<=s.y+10; j+=10)
        {
            if((j<0) || (j>=100)) continue;
            if(i === s.x && j === s.y ) continue;
            if(map.grid[(i)/10][(j)/10]) continue;

            var neighbour = new Node(i, j, s, dest);
            var c = is_already_present(neighbour, closed_list);
            if( c >= 0){
                neighbour.g = closed_list[c].g + distance(s,i,j);
                neighbour.h = distance(dest, i,j);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.parent = s;

                var o = is_already_present(neighbour, open);
                if( o >= 0){
                    if(neighbour.f < open[o].f)
                        open[o]=neighbour;
                }
            }
            else
                open.push(neighbour);
        }
    }
}

function best_node (list){
    var best_cost = list[0].f;
    var best_node = list[0];
    for(var i=0; i<list.length; i++)
    {
        if(list[i].f < best_cost){
            best_cost = list[i].f;
            best_node = list[i];
        }
    }
    return best_node;
}


function find_way (){
    var offset = 1;
    var n = closed_list[closed_list.length-offset++];
    var father = n.parent;


    path.unshift(n);

    while( ! (father.x === 0 && father.y === 0)){
        n=father;
        //console.log(n.x + " " + n.y);
        path.unshift(n);
        n = find_parent(father);
        father = n.parent;
    }
}


function main(event)
{
    var x = Math.floor(event.clientX / 10) * 10;
    var y = Math.floor(event.clientY / 10) * 10;
    dest = new Node(x,y,null,null);
    var source = new Node(0,0,null,dest);
    var current = new Node(0, 0, source, dest);

    if(map.grid[x/10][y/10]) { console.log("out");return; }

    //console.log("Begin : dest(" +x+","+y+")");

    open.push(current);
    add_neighbours(current);
    add_to_closed_list(current);


    while( ! ((current.x === dest.x) && (current.y === dest.y)) && open.length > 0 )
    {
        current = best_node(open);
        add_to_closed_list(current);
        add_neighbours(current);
    }

    if(current.x === dest.x && current.y === dest.y)
    {
        // Un chemin a été trouvé. find way remplit la liste path avec les bon noeuds
        find_way();
        get_infos(path);
        console.log("got it !");
    }
    else
        console.log("pas de solution");
}

function get_infos(list)
{
    for(var i=0; i<list.length; i++){
        console.log("(" + list[i].x + "," + list[i].y +")");
        console.log("cout : f:" + list[i].f + " g : " + list[i].g + " h: " + list[i].h);
    }
}

function find_parent (n) {
    for(var node=0; node < closed_list.length; node++)
    {
        if(n.x === closed_list[node].x && n.y === closed_list[node].y)
            return closed_list[node];
    }
    return null;
}
