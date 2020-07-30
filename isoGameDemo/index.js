var c = document.getElementById("c");
var ctx = c.getContext("2d");
let lastTime = 0;
var dt;

var state = "game";
var player = {
    x: 500,
    y: 0,
    up: false,
    down: false,
    left: false, 
    right: false,
    speed: 5,
    rot: 1,
    vx: 500,
    vy: 0,
}
var jeff = 0.1;
var map = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //LEAVE BORDER OF 0
];
var map_loc = {x: map[0].length, y: 600};

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
    
    //draw_rect(0,0,c.width,c.width / 2, "white", true, "black");
    //draw_rect(0,0,400,200, "red");
    //draw_rect(200,100,400,200, "darkred");
    
    draw_map(map_loc.x, map_loc.y);

    ctx.fillStyle = "red";
    //ctx.fillRect(player.x, player.y, 100, 200);

    player_move();
    draw_rect3D(player.x, player.y, 100, 50, 100, "red", "lime", "blue")
    
    edge_col(map, player);
    
    map_loc.y = 600 + Math.sin(jeff) * 20
    jeff+=0.05;
    
    ctx.fillStyle = "black";
    ctx.font = "70px arial";
    ctx.fillText("Isometric Game Engine Demo", 30, 100);
    ctx.font = "50px arial";
    ctx.fillText("Use Arrow Keys to Move", 30, 150);
}

function draw_map(ox, oy) {
    for (y = 0; y < map.length; y++) {
        for (x = map[y].length; x > -1; x--) {
            if (map[y][x] == 1) {
//                if (map[y-1][x] == 1 && 
//                    map[y+1][x] == 1 && 
//                    map[y][x-1] == 1 && 
//                    map[y][x+1] == 1) {
//                    
//                    draw_rect(
//                    ox + (x * 50) + (y * 50),   //x
//                    oy - (x * 25) + (y * 25),   //y
//                    100,                        //w
//                    50,                         //h
//                    "red")                      //color  
//                    
//                } else {
//                 
//                    draw_rect3D(
//                    ox + (x * 50) + (y * 50),   //x
//                    oy - (x * 25) + (y * 25),   //y
//                    100,                        //w
//                    50,                         //h
//                    50,                         //d
//                    "orange",                      //top 
//                    "lime",                     //left
//                    "blue")                     //right            
//                }
                
                if (map[y][x-1] == 0 || 
                    map[y+1][x] == 0 || 
                    map[y][x-1] == 2 || 
                    map[y+1][x] == 2) {
                    
                    draw_rect3D(
                    ox + (x * 50) + (y * 50),   //x
                    oy - (x * 25) + (y * 25),   //y
                    100,                        //w
                    50,                         //h
                    50,                         //d
                    "rgb(0,200,0)",                      //top 
                    "lime",                     //left
                    "rgb(0,150,0)")                     //right
                    
                } else {
                    
                    draw_rect(
                    ox + (x * 50) + (y * 50),   //x
                    oy - (x * 25) + (y * 25),   //y
                    100,                        //w
                    50,                         //h
                    "rgb(0,200,0)")                      //color 
                    
                }
            } else if (map[y][x] == 2) {
                
                draw_rect(
                    ox + (x * 50) + (y * 50),   //x
                    oy - (x * 25) + (y * 25) + 50,   //y
                    100,                        //w
                    50,                         //h
                    "cyan")                      //color 
            }
        }
    }
}

function player_move() {
    if (player.left) {
        player.vx -= player.speed;
    }
    
    if (player.right) {
        player.vx += player.speed;
    }
    
    if (player.up) {
        player.vy -= (player.speed);
    }
    
    if (player.down) {
        player.vy += (player.speed);
    }
    
    player.x = map_loc.x + player.vx;
    player.y = map_loc.y + player.vy;
}

//map_loc.x + (x * 50) + (y * 50), map_loc.y - (x * 25) + (y * 25) + 25, 4, 4

function edge_col(mp, obj) {
    for (y = 0; y < mp.length; y++) {
        for (x = mp[y].length; x > -1; x--) {
            if (mp[y][x] == 1) {
                if (mp[y+1][x] == 0 || 
                    mp[y-1][x] == 0 || 
                    mp[y][x+1] == 0 || 
                    mp[y][x-1] == 0 || 
                    mp[y+1][x] == 2 || 
                    mp[y-1][x] == 2 || 
                    mp[y][x+1] == 2 || 
                    mp[y][x-1] == 2) {
                    
                    //draw_rect(
                    //map_loc.x + (x * 50) + (y * 50),   //x
                    //map_loc.y - (x * 25) + (y * 25),   //y
                    //100,                        //w
                    //50,                         //h
                    //"red")                     //right
                    
                    var verts = [
                        {x: map_loc.x + (x * 50) + (y * 50), 
                         y: map_loc.y - (x * 25) + (y * 25)+25},
                        
                        {x: map_loc.x + (x * 50) + (y * 50)+50, 
                         y: map_loc.y - (x * 25) + (y * 25)},
                        
                        {x: map_loc.x + (x * 50) + (y * 50)+100, 
                         y: map_loc.y - (x * 25) + (y * 25)+25},
                        
                        {x: map_loc.x + (x * 50) + (y * 50)+50, 
                         y: map_loc.y - (x * 25) + (y * 25)+50}
                        
                    ];
                    
                    if (mp[y][x-1] == 0 || mp[y][x-1] == 2) {
                        //left
                        for (i = 0; i < verts.length; i++) {
                            verts[i].x -= 50;
                            verts[i].y += 25;
                        }
                        
                        if (polyPoint(verts, player.x, player.y + 125) || polyPoint(verts, player.x+50, player.y + 150)) {
                            player.vx+=player.speed;
                            player.left = false;
                            player.right = false;
                            player.up = false;
                            player.down = false;
                        }
                        
                    } else if (mp[y][x+1] == 0 || mp[y][x+1] == 2) {
                        //right
                        
                        for (i = 0; i < verts.length; i++) {
                            verts[i].x += 50;
                            verts[i].y -= 25;
                        }
                        
                        if (polyPoint(verts, player.x+100, player.y + 125)|| polyPoint(verts, player.x+50, player.y + 100)) {
                            player.vx-=player.speed;
                            player.left = false;
                            player.right = false;
                            player.up = false;
                            player.down = false;
                        }
                    } else if (mp[y-1][x] == 0 || mp[y-1][x] == 2) {
                        //up
                        for (i = 0; i < verts.length; i++) {
                            verts[i].x -= 50;
                            verts[i].y -= 25;
                        }
                        
                        if (polyPoint(verts, player.x, player.y + 125)|| polyPoint(verts, player.x+50, player.y + 100)) {
                            player.vy+=player.speed;
                            player.left = false;
                            player.right = false;
                            player.up = false;
                            player.down = false;
                        }
                        
                    } else if (mp[y+1][x] == 0 || mp[y+1][x] == 2) {
                        //down
                        for (i = 0; i < verts.length; i++) {
                            verts[i].x += 50;
                            verts[i].y += 25;
                        }
                        
                        if (polyPoint(verts, player.x+50, player.y + 150)|| polyPoint(verts, player.x+100, player.y + 125)) {
                            player.vy-=player.speed;
                            player.left = false;
                            player.right = false;
                            player.up = false;
                            player.down = false;
                        }
                        
                    }
                    
//                    ctx.fillStyle = "orange";
//                    ctx.beginPath();
//                    ctx.moveTo(verts[0].x, verts[0].y)
//                    ctx.lineTo(verts[1].x, verts[1].y)
//                    ctx.lineTo(verts[2].x, verts[2].y)
//                    ctx.lineTo(verts[3].x, verts[3].y)
//                    ctx.fill();
                    
                    
                    
                    //PLAYER POINTS COORDS
                    //y125
                    //x50 y150
                    //x100 y125
                    //x50 y100
                    
                    //DRAW POINTS
//                    ctx.fillStyle = "purple";
//                    ctx.fillRect(player.x , player.y + 125, 10, 10);
//                    ctx.fillRect(player.x + 50, player.y + 150, 10, 10);
//                    ctx.fillRect(player.x + 100, player.y + 125, 10, 10);
//                    ctx.fillRect(player.x + 50, player.y + 100, 10, 10);
                    
                    //ctx.fillRect(map_loc.x + (x * 50) + (y * 50)+50,
                      //           map_loc.y - (x * 25) + (y * 25)+50,
                        //         100,50);
                    //y25
                    //x50
                    //x100 y25
                    //x50 y50
                    
                    //ox + (x * 50) + (y * 50),   //x
                    //oy - (x * 25) + (y * 25),   //y
                    //100,                        //w
                    //50,                         //h
                }
            }
        }
    }
}

function polyPoint(vertices, px, py) {
  var collision = false;

  // go through each of the vertices, plus
  // the next vertex in the list
  var next = 0;
  for (current=0; current<vertices.length; current++) {

    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current+1;
    if (next == vertices.length) {next = 0;}

    // get the PVectors at our current position
    // this makes our if statement a little cleaner
    var vc = vertices[current];    // c for "current"
    var vn = vertices[next];       // n for "next"

    // compare position, flip 'collision' variable
    // back and forth
    if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
         (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
            collision = !collision;
    }
  }
  return collision;
}

function draw_rect(x, y, w, h, color, show, sColor) {
    if (show) {
        ctx.fillStyle = sColor;
        ctx.fillRect(x, y, w, h);
    }
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + (h / 2));
    ctx.lineTo(x + (w / 2), y);
    ctx.lineTo(x + w, y + (h / 2));
    ctx.lineTo(x + (w / 2), y + h);
    ctx.fill();
}

function draw_rect3D(x, y, w, h, d, color, left_col, right_col, show, sColor) {
    if (show) {
        ctx.fillStyle = sColor;
        ctx.fillRect(x, y, w, h);
    }
    
    //top
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + (h / 2));
    ctx.lineTo(x + (w / 2), y);
    ctx.lineTo(x + w, y + (h / 2));
    ctx.lineTo(x + (w / 2), y + h);
    ctx.fill();
    
    //left
    ctx.fillStyle = left_col;
    ctx.beginPath();
    ctx.moveTo(x, y + (h / 2));
    ctx.lineTo(x, y + (h / 2) + d);
    ctx.lineTo(x + (w / 2), y + h + d);
    ctx.lineTo(x + (w / 2), y + h);
    ctx.fill();
    
    //right
    ctx.fillStyle = right_col;
    ctx.beginPath();
    ctx.moveTo(x + (w / 2), y + h);
    ctx.lineTo(x + w, y + (h / 2));
    ctx.lineTo(x + w, y + (h / 2) + d);
    ctx.lineTo(x + (w / 2), y + h + d);
    ctx.fill();
}


function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;
    
    switch (state) {
        case "menu":
            draw_menu();
            break;
        
        case "game":
            draw_game();
            break; 
        
    }
    
    requestAnimationFrame(update);
}

//KEY HANDELING
window.onkeydown = function(e) {
    switch (state) {
        case "menu":
            break;
            
        case "game":
            //left
            if (e.keyCode == 37) {
                player.left = true;
                break;
            }

            //right
            if (e.keyCode == 39) {
                player.right = true;
                break;
            }

            //up
            if (e.keyCode == 38) {
                player.up = true;
                break;
            }

            //down     
            if (e.keyCode == 40) {
                player.down = true;
                break;
            }
            
            //space
            if (e.keyCode == 32) {
                break;
            }
            
            break;   
    }
             
}

window.onkeyup = function(e) {
    switch (state) {
        case "menu":
            break;
            
        case "game":
            //left
            if (e.keyCode == 37) {
                player.left = false;
                break;
            }

            //right
            if (e.keyCode == 39) {
                player.right = false;
                break;
            }

            //up
            if (e.keyCode == 38) {
                player.up = false;
                break;
            }

            //down     
            if (e.keyCode == 40) {
                player.down = false;
                break;
            }
            
            //space
            if (e.keyCode == 32) {
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

update();
