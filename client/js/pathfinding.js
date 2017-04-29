open = [];
closed_list = [];
path = [];

function Node (x, y, parent, dest)
{
    this.x = x;
    this.y = y;
    this.parent = parent;
    if(parent !== null)
        this.g = parent.g + 32;
    else
        this.g = 0;
    if(dest !== null)
        this.h= Math.abs(dest.x-x) + Math.abs(dest.y-y);
    this.f= this.g + this.h;
}

function distance (s, x, y) {
    // return Math.sqrt((s.x - x)*(s.x - x) + (s.y - y)*(s.y - y));
    return (Math.abs(s.x - x) + Math.abs(s.y - y));
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

function add_neighbours (s, map, dest, xWorld, yWorld, tileSize){
    // var tmp;

    for(var i=s.x - tileSize; i <=s.x+tileSize; i+=tileSize)
    {
        if((i<0) || (i>=xWorld)) continue;
        for(var j=s.y - tileSize; j<=s.y+tileSize; j+=tileSize)
        {
            if((j<0) || (j>=yWorld)) continue;
            if(i === s.x && j === s.y ) continue;
            if(map[(j)/tileSize][(i)/tileSize] == 1) continue;

            // console.log("Ah");

            // tmp = new Node(i, j, s, dest);
            
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


function find_way (source){
    var offset = 1;
    var n = closed_list[closed_list.length-offset++];
    var father = n.parent;


    path.unshift(n);

    while( ! (father.x === source.x && father.y === source.y)){
        n=father;
        // console.log(n.x + " " + n.y);
        path.unshift(n);
        n = find_parent(father);
        father = n.parent;
    }
}


function getPath(xUnit, yUnit, xClick, yClick, map, xWorld, yWorld, tileSize)
{
    open = [];
    closed_list = [];
    path = [];
    var x = Math.floor(xClick / tileSize) * tileSize;
    var y = Math.floor(yClick / tileSize) * tileSize;
    var xu = Math.floor(xUnit / tileSize) * tileSize;
    var yu = Math.floor(yUnit / tileSize) * tileSize;
    var dest = new Node(x,y,null,null);
    var source = new Node(xu,yu,null,dest);
    var current = new Node(source.x, source.y, source, dest);

    if(x < 0 || x > xWorld || y < 0 || y > yWorld || map[y/tileSize][x/tileSize] == 1) { console.log("out");return path; }

    // console.log("Begin : dest(" +x+","+y+")");
    // console.log("Depart : " + xu +" "+yu);

    open.push(current);
    add_to_closed_list(current);
    add_neighbours(current, map, dest, xWorld, yWorld, tileSize);


    // console.log({x : current.x, y : current.y});
    // console.log({x : dest.x, y : dest.y});

    while( ! ((current.x === dest.x) && (current.y === dest.y)) && open.length > 0 )
    {
        current = best_node(open);
        // console.log({x : current.x, y : current.y});
        // get_infos(closed_list);
        // get_infos(open);

        add_to_closed_list(current);
        add_neighbours(current, map, dest, xWorld, yWorld, tileSize);
    }

    if(current.x === dest.x && current.y === dest.y)
    {
        // Un chemin a été trouvé. find way remplit la liste path avec les bon noeuds
        find_way(source);
        // get_infos(path);
        // console.log("got it !");
    }
    else{
        // console.log("pas de solution");
        //get_infos(open);
    }

    // console.log(current);

    return path;
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
