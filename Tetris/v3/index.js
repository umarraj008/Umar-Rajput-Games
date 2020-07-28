var c = document.getElementById("c");
var ctx = c.getContext("2d");
let lastTime = 0;
var dt;

//best score
//score
//lines

//to do///////////////////////
//main menu
//game over screen
//outer gui
//save cookies data
//cheat mode
//chaning color themes
//add shift
//scores database

var state = "game";
var drop_count = 0;
var arena_border_width = 10;
var grid_width = 2;
var arena_pos = {x: (c.width / 2) - (6 * 50), y:40}
var arena = [
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
];
/*var arena = [
    [0,1,2,3,4,5,6,7,0,1,2,3],
    [7,0,1,2,3,4,5,6,7,0,1,2],
    [6,7,0,1,2,3,4,5,6,7,0,1],
    [5,6,7,0,1,2,3,4,5,6,7,0],
    [4,5,6,7,0,1,2,3,4,5,6,7],
    [3,4,5,6,7,0,1,2,3,4,5,6],
    [2,3,4,5,6,7,0,1,2,3,4,5],
    [1,2,3,4,5,6,7,0,1,2,3,4],
    [0,1,2,3,4,5,6,7,0,1,2,3],
    [7,0,1,2,3,4,5,6,7,0,1,2],
    [6,7,0,1,2,3,4,5,6,7,0,1],
    [5,6,7,0,1,2,3,4,5,6,7,0],
    [4,5,6,7,0,1,2,3,4,5,6,7],
    [3,4,5,6,7,0,1,2,3,4,5,6],
    [2,3,4,5,6,7,0,1,2,3,4,5],
    [1,2,3,4,5,6,7,0,1,2,3,4],
    [0,1,2,3,4,5,6,7,0,1,2,3],
    [7,0,1,2,3,4,5,6,7,0,1,2],
    [6,7,0,1,2,3,4,5,6,7,0,1],
    [5,6,7,0,1,2,3,4,5,6,7,0],
];*/
var colors = [
    "white", 
    "red", 
    "green", 
    "blue", 
    "yellow", 
    "orange", 
    "pink",
    "cyan",
]
var player = {
    pos: {x: 0, y: 0},
    matrix: [],
    p: [],
    rows_cleared: 0,
    score: 0,
    current_level: 1,
    next_level: 2,    
    levels_speed: [10000000,
             1000,
             900,
             800,
             700,
             600,
             500,
             400,
             300,
             200,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
             100,
            ],
    line_count: 0,
    dificulty: 10,
}
var peices = "ILJOTSZ";
var drop_interval = player.levels_speed[player.current_level];
var bars = [];
var stop = false;
var timer = 0;
var barOpacity = 1;
var game_over = false;
var game_overH = -50;
var game_over_counter = 0;
var guide_enabled = true;

function player_move(dir) {
    if (dir == "l") {
        player.pos.x--;
        
        if (colision(arena, player)) {
            player.pos.x++;
        }
    }

    if (dir == "r") {
        player.pos.x++;
        
        if (colision(arena, player)) {
            player.pos.x--;
        }
    }
}

function player_drop(key) {
    var ps = player.pos.y;
    player.pos.y++;
    var es = player.pos.y;
    
    if (key) {
        player.score += (es - ps);
    }
    
    if (colision(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        player_reset();
        arena_sweep();
    }
    
    drop_count = 0;
}

function full_drop() {
    var ps = (player.pos.y);
    
    while(!colision(arena, player)) {
        player.pos.y++;
    }
    
    if (colision(arena, player)) {
        player.pos.y--;
    
        var ep = (player.pos.y);
        player.score += (ep - ps);
        
        merge(arena, player);
        player_reset();
        arena_sweep();
    }
    
    drop_count = 0;
}

function arena_sweep() {
    let rowCount = 1;
    outer: for(let y = arena.length - 1; y > 0; --y) {
        for(let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        
        bars.push(y);
        stop = true;
        
//        const row = arena.splice(y, 1)[0].fill(0);
//        arena.unshift(row);
//        ++y;
//        
//        player.rows_cleared += rowCount;
//        player.line_count += rowCount;
//        player.score += rowCount * (40 * player.current_level);
    }
        
    //set level
    if (player.line_count >= player.dificulty) {
        player.current_level++;
        player.next_level++;
        drop_interval = player.levels_speed[player.current_level]
        player.line_count = 0;
        player.dificulty+=2;
    }

}

function remove_rows() {
    let rowCount = 1;
    outer: for(let y = arena.length - 1; y > 0; --y) {
        for(let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        
        player.rows_cleared += rowCount;
        player.line_count += rowCount;
        player.score += rowCount * (40 * player.current_level);
    }
        
    //set level
    if (player.line_count >= player.dificulty) {
        player.current_level++;
        player.next_level++;
        drop_interval = player.levels_speed[player.current_level]
        player.line_count = 0;
        player.dificulty+=2;
    }

}

function merge(arena, player) {
    player.matrix.forEach((row,y ) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function player_reset() {
    player.matrix = create_p(player.p[0]);
    player.p.shift();
    player.p.push(peices[peices.length * Math.random() | 0]);
    
    player.pos = {x: (arena[0].length / 2 | 0) - 
        (player.matrix[0].length / 2 | 0), y: 0}
    
    //game over
    if (colision(arena, player)) {
        guide_enabled = false;
        game_over = true;
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
             [
                 matrix[x][y],
                 matrix[y][x],
             ] = [
                 matrix[y][x],
                 matrix[x][y],
             ];
        }
    }
    
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    }else {
        matrix.reverse();
    }
}

function player_rotate(dir) {
    let pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    
    while (colision(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function create_p(type) {
    if (type == "T") {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    }else if (type == "O") {
        return [
            [2, 2],
            [2, 2],
        ];
    }else if (type == "L") {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    }else if (type == "J") {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    }else if (type == "I") {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    }else if (type == "S") {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    }else if (type == "Z") {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

function colision(arena, p) {
    const [m, o] = [p.matrix, p.pos];
    for(let y =0; y < m.length; y ++) {
        for (let x = 0; x < m[y].length; x++) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function draw_player() {
    ctx.save();
    ctx.scale(50, 50);
    for(y = 0; y < player.matrix.length; y++) {
        for (x = 0; x < player.matrix[y].length; x++) {
            if (player.matrix[y][x] !== 0) {
                ctx.fillStyle = "black";
                ctx.fillRect((arena_pos.x / 50) + x + player.pos.x - 0.1, (arena_pos.y / 50) + y + player.pos.y - 0.1, 1.1, 1.1);

                ctx.fillStyle = colors[player.matrix[y][x]];
                ctx.fillRect((arena_pos.x / 50) + x + player.pos.x, (arena_pos.y / 50) + y + player.pos.y, 0.9, 0.9);
            }
            
            //animation
//            arena[y][x]++;
//            if (arena[y][x] > 7) {
//                arena[y][x] = 0;
//            }
        }
    }
    
    ctx.restore();
}

function draw_player2(OX, OY) {
    var nextP = create_p(player.p[0]);
    
    ctx.save();
    ctx.scale(50, 50);
    for(y = 0; y < nextP.length; y++) {
        for (x = 0; x < nextP[y].length; x++) {
            if (nextP[y][x] !== 0) {
                ctx.fillStyle = "black";
                ctx.fillRect(x + OX - 0.1, y + OY - 0.1, 1.1, 1.1);

                ctx.fillStyle = colors[nextP[y][x]];
                ctx.fillRect(x + OX, y + OY, 0.9, 0.9);
            }
        }
    }
    
    ctx.restore();
}
    
function draw_arena() {
    
    //arena back
    ctx.fillStyle = "white";
    ctx.fillRect(arena_pos.x,arena_pos.y,(arena[0].length * 50) - 5, (arena.length * 50) - 5);
    

    //peices
    ctx.save();
    ctx.scale(50, 50);
    
    //grid
    ctx.fillStyle = "rgb(200,200,200)";
    for (i = 1; i < 12; i++) {
        ctx.fillRect((arena_pos.x/50) + i - 0.1, (arena_pos.y/50), 0.1, arena.length - 0.1)
    }
    
    for (i = 1; i < 20; i++) {
        ctx.fillRect((arena_pos.x/50), (arena_pos.y/50) + i - 0.1, arena[0].length - 0.1, 0.1)
    }
    
    for(y = 0; y < arena.length; y++) {
        for (x = 0; x < arena[y].length; x++) {
            
            if (arena[y][x] !== 0) {
                ctx.fillStyle = "black";
                ctx.fillRect((arena_pos.x / 50) + x - 0.1, (arena_pos.y / 50) + y - 0.1, 1.1, 1.1);
                
                ctx.fillStyle = colors[arena[y][x]];
                ctx.fillRect((arena_pos.x / 50) + x, (arena_pos.y / 50) + y, 0.9, 0.9);
            }
            
            //animation
//            arena[y][x]++;
//            if (arena[y][x] > 7) {
//                arena[y][x] = 0;
//            }
        }
    }
    
    ctx.restore();
}

function draw_menu() {
    ctx.fillStyle = "black";
    ctx.font = "100px arial";
    ctx.textAlign = "center";
    ctx.fillText("Tetris", c.width / 2, 200);
    
}

function draw_game() {
    //background
    ctx.fillStyle = "rgb(230,230,230)";
    ctx.fillRect(0,0,c.width,c.height);
    
    //border
    /*ctx.fillStyle = "white"
    ctx.fillRect(0,0,c.width, c.height);
    ctx.fillStyle = "black";
    ctx.fillRect(5, 5, c.width - 10, c.height - 10);*/
    
    //arena border
    ctx.fillStyle = "black";
    ctx.fillRect(
        arena_pos.x-arena_border_width,
        arena_pos.y-arena_border_width,
        (arena[0].length * 50) + (arena_border_width * 2) - 5, 
        (arena.length * 50) + (arena_border_width * 2) - 5);
    
    //draw arena
    draw_arena();
    
    //draw guide
    if (guide_enabled) {
        draw_guide();    
    }
    
    //draw player
    draw_player();
 
    //edge covers
    //ctx.fillStyle = "white";
    //ctx.fillRect(0,0,arena_pos.x - arena_border_width,c.height)
    
    //leaderboard
    ctx.fillStyle = "rgb(100,100,100)";
    ctx.font = "90px Russo One";
    ctx.textAlign = "left";
    ctx.fillText("Leaderboard", 40, 200);
    ctx.fillText("Score: " + player.score, 40, 300);
    ctx.fillText("Lines: " + player.rows_cleared, 40, 400);
    ctx.fillText("Level: " + player.current_level, 40, 500);
    ctx.fillText("Speed: " + (drop_interval/arena.length), 40, 600);
    
    //draw next peice
    ctx.fillStyle = "black";
    ctx.fillRect(arena_pos.x + (arena[0].length * 50) + 40,arena_pos.y - 10,220,220);
    
    ctx.fillStyle = "white";
    ctx.fillRect(arena_pos.x + (arena[0].length * 50) + 50,arena_pos.y,200,200);
    
    var temp = create_p(player.p[0]);
    
    if (temp.length == 2) {
        draw_player2((arena_pos.x/50) + (arena[0].length) + 2,(arena_pos.y/50)+1);
    } 
    
    if (player.p[0] == "L") {
        draw_player2((arena_pos.x/50) + (arena[0].length) + 1,(arena_pos.y/50)+0.5);
        
    } else if (player.p[0] == "J") {
        draw_player2((arena_pos.x/50) + (arena[0].length) + 2,(arena_pos.y/50)+0.5);
        
    } else if (player.p[0] == "S") {
        draw_player2((arena_pos.x/50) + (arena[0].length) + 1.5,(arena_pos.y/50)+1);
        
    } else if (player.p[0] == "Z") {
        draw_player2((arena_pos.x/50) + (arena[0].length) + 1.5,(arena_pos.y/50)+1);
        
    }else if (player.p[0] == "I") {
        draw_player2((arena_pos.x/50) + (arena[0].length) + 1.5,(arena_pos.y/50));
        
    } else if (player.p[0] == "T") {
        draw_player2((arena_pos.x/50) + (arena[0].length) + 1.5,(arena_pos.y/50) + 0.25);
        
    } 
    
    
    
    //black bars
    
    for (i = 0; i < bars.length; i++) {
        ctx.save();
        ctx.scale(50,50);
        ctx.fillStyle = "rgba(255,255,255," + barOpacity + ")";
        ctx.fillRect((arena_pos.x/50), bars[i] +( arena_pos.y/50), arena[0].length, 1);
        ctx.restore();     
    }
    
    
    if (game_over) {
        ctx.fillStyle = "white";
        ctx.fillRect(arena_pos.x, arena_pos.y + (arena.length * 50) - 5, (arena[0].length * 50) - 5, game_overH +5);
        
        game_over_counter += dt;
        
        if (game_over_counter > 100 && game_overH > -1000) {
            game_over_counter = 0;
            game_overH -= 50;
        }
    }
    
    
    ctx.fillStyle = "rgb(230,230,230)";
    ctx.fillRect(arena_pos.x-10, arena_pos.y-10, (arena[0].length*50)+15, -30);
    
    ctx.fillStyle = "black";
    ctx.fillRect(arena_pos.x-10, arena_pos.y-10, (arena[0].length*50)+15, 10);//
    ctx.fillRect(arena_pos.x-10, arena_pos.y-10, 10, arena.length * 50 + 15);
    ctx.fillRect(arena_pos.x + (arena[0].length * 50) - 5, arena_pos.y-10, 10, arena.length * 50 + 15);
    ctx.fillRect(arena_pos.x-10, arena_pos.y + arena.length * 50 - 5, (arena[0].length*50)+15, 10);//
}

function draw_guide() {
    var OY = 0;
    var guide = {matrix: player.matrix, pos: {x: player.pos.x, y: player.pos.y}};
    
    while(!colision(arena, guide)) {
        guide.pos.y++;    
    }
    
    guide.pos.y--;
    
    ctx.save();
    ctx.scale(50, 50);
    for(y = 0; y < player.matrix.length; y++) {
        for (x = 0; x < player.matrix[y].length; x++) {
            if (player.matrix[y][x] !== 0) {
                ctx.fillStyle = "rgb(140,140,140)";
                ctx.fillRect((arena_pos.x / 50) + x + player.pos.x - 0.1, (arena_pos.y / 50) + y + guide.pos.y - 0.1, 1.1, 1.1);

                ctx.fillStyle = "rgb(220,220,220)";
                ctx.fillRect((arena_pos.x / 50) + x + player.pos.x, (arena_pos.y / 50) + y + guide.pos.y, 0.9, 0.9);
            }
        }
    }
    
    ctx.restore();
}

function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;
    
    switch (state) {
        case "menu":
            draw_menu();
            break;
        
        case "game":
            if (!stop && !game_over) {
                drop_count += dt;
                if (drop_count > drop_interval) {
                    player_drop(false);    
                }
            }
            
            if (stop) {
                timer+=dt;
                
                if (timer> 50 && timer < 100) {
                    barOpacity = 0;
                }
                
                if (timer> 100 && timer < 200) {
                    barOpacity = 1;
                }
                
                
                
                if (timer > 200) {
                    remove_rows();
                    stop = false;
                    timer = 0;
                    bars = [];
                }
                
            }
            
            draw_game();
            break; 
        
    }
    
    requestAnimationFrame(update);
}

var space_en = true;
//KEY HANDELING
window.onkeydown = function(e) {
    switch (state) {
        case "menu":
            break;
            
        case "game":
            //left
            if (e.keyCode == 37) {
                player_move("l");
                break;
            }

            //right
            if (e.keyCode == 39) {
                player_move("r");
                break;
            }

            //up
            if (e.keyCode == 38) {
                player_rotate(1);
                break;
            }

            //down     
            if (e.keyCode == 40) {
                player_drop(true);
                break;
            }
            
            //space
            if (e.keyCode == 32) {
                full_drop();
                break;
            }
            
            break;   
    }
             
}


function resizeWindow() {
    var off = 0;
    c.style.left = 0;
    off = (window.innerWidth - c.clientWidth) / 2;
    c.style.left = off + "px";
}

window.onresize = resizeWindow;
resizeWindow();

for (i = 0; i < 4; i++) {
    player.p.push(peices[peices.length * Math.random() | 0])
}

player_reset();
update();
