const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

const can2 = document.getElementById("NextP");
const ctx2 = can2.getContext("2d");
context.scale(20,20);
ctx2.scale(40,40);

const pieces = "ILJOTSZ";
var nextP = [0];
var ind = 0;

let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

var database = firebase.database();
var ref = database.ref("Scores");
var inputName = null;
var HighScores = [];

const em1 = "🏆";
const em2 = "🥈";
const em3 = "🥉";

var calcY = 0;
var calcMat;

var cheat = false;
var flasher = true;
var gridEnabled = true;
var gameStarted = false;
var guideEnabled = true;

var titleImg = document.getElementById("titleImg");

var blockImg = {
    red: document.getElementById("redBlock"),
    blue_light: document.getElementById("greenBlock"),
    green: document.getElementById("bluelightBlock"),
    pink: document.getElementById("pinkBlock"),
    orange: document.getElementById("orangeBlock"),
    yellow: document.getElementById("yellowBlock"),
    blue_dark: document.getElementById("bluedarkBlock"),
}


function arenaSweep() {
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
        player.score += rowCount * 10;
        rowCount *= 2;
        if (flasher) {
            flash("white");
        }
    }
}

function flash(color) {
    document.getElementById("body").style.background = color;
    window.setTimeout(function() {document.getElementById("body").style.background = "black"}, 100);
    window.setTimeout(function() {document.getElementById("body").style.background = color}, 200);
    window.setTimeout(function() {document.getElementById("body").style.background = "black"}, 300);
    window.setTimeout(function() {document.getElementById("body").style.background = color}, 400);
    window.setTimeout(function() {document.getElementById("body").style.background = "black"}, 500);
}

function colision(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for(let y =0; y < m.length; y ++) {
        for (let x = 0; x < m[y].length; x++) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
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

function draw() {
    //arena
    context.fillStyle = "black";
    context.fillRect(0,0,canvas.width, canvas.height);
    
    drawMatrix(arena, {x:0, y:0})
    
    //grid
    if (gridEnabled) {
        for (i = 0; i < 14; i++) {
            context.fillStyle = "#2e2e2e";
            context.fillRect(i - 0.025, 0, 0.05, canvas.height);
        }

        for (i = 0; i < 21; i++) {
            context.fillStyle = "#2e2e2e";
            context.fillRect(0, i - 0.025, canvas.width, 0.05);
        }
    }
    
    //guide
    if (guideEnabled) {
        calcY = 0;
        while (colision(arena, {matrix: calcMat, pos: {x: player.pos.x, y: calcY}}) == false) {
            calcY++;
        }
        calcY--;
        drawMatrixGUIDE(calcMat, {x: player.pos.x, y: calcY});  
    }
    
    //player
    drawMatrix(player.matrix, player.pos);  
	
    //next peice
	ctx2.fillStyle = "#000";
    ctx2.fillRect(0,0,can2.width,can2.height);
    drawMatrix2(nextP[ind + 1], 0 , 0);  
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            
//            if (value !== 0) {
//                context.fillStyle = colors[value];
//                context.fillRect(x + offset.x,
//                                 y + offset.y,
//                                 1, 1);
//            }
            
            
            if (value !== 0) {
                
                switch (value) {
                    case 1: context.drawImage(blockImg.red, x + offset.x, y + offset.y,1, 1);
                        break;
                        
                    case 2: context.drawImage(blockImg.blue_light, x + offset.x, y + offset.y,1, 1);
                        break;
                        
                    case 3: context.drawImage(blockImg.green, x + offset.x, y + offset.y,1, 1);
                        break;
                        
                    case 4: context.drawImage(blockImg.pink, x + offset.x, y + offset.y,1, 1);
                        break;
                        
                    case 5: context.drawImage(blockImg.orange, x + offset.x, y + offset.y,1, 1);
                        break;
                        
                    case 6: context.drawImage(blockImg.yellow, x + offset.x, y + offset.y,1, 1);
                        break;
                        
                    case 7: context.drawImage(blockImg.blue_dark, x + offset.x, y + offset.y,1, 1);
                        break;
                    
                }
                
                
//                "#FF0D72",
//                "#0DC2FF",
//                "#0DFF72",
//                "#F538FF",
//                "#FF8E0D",
//                "#FFE138",
//                "#3877FF",
            }
                
        });
    });
}

function drawMatrix2(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
//            if (value !== 0) {
//                ctx2.fillStyle = colors[value];
//                ctx2.fillRect(x + 1.6 , y + 1.6, 1, 1);
//            }
            
            
            if (value !== 0) {
                
                switch (value) {
                    case 1: ctx2.drawImage(blockImg.red, x + 1.6, y + 1.6 - 0.5, 1, 1);
                        break;
                        
                    case 2: ctx2.drawImage(blockImg.blue_light, x + 1.6 + 0.5, y + 1.6 + 0.4, 1, 1);
                        break;
                        
                    case 3: ctx2.drawImage(blockImg.green, x + 1.6 - 0.5, y + 1.6, 1, 1);
                        break;
                        
                    case 4: ctx2.drawImage(blockImg.pink, x + 1.6 + 0.5, y + 1.6, 1, 1);
                        break;
                        
                    case 5: ctx2.drawImage(blockImg.orange, x + 1.6, y + 1.6 - 0.5, 1, 1);
                        break;
                        
                    case 6: ctx2.drawImage(blockImg.yellow, x + 1.6, y + 1.6 + 0.5, 1, 1);
                        break;
                        
                    case 7: ctx2.drawImage(blockImg.blue_dark, x + 1.6, y + 1.6 + 0.3, 1, 1);
                        break;
                    
                }
            }
        });
    });
}

function drawMatrixGUIDE(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[8];
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
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

function playerMove(dir) {
    player.pos.x += dir;
    
    if (colision(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    ind++;
	
	nextP.push(createPiece(pieces[pieces.length * Math.random() | 0]));
	
	player.matrix = nextP[ind]; 
    calcMat = nextP[ind];
    	
	player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - 
        (player.matrix[0].length / 2 | 0);
    
    if (colision(arena, player)) {
        flash("red");
        updateScore();
        dropInterval = 100000000000;
        
        if (player.score > HighScores[14].Score) {
            setTimeout(function() {
                try {

                    while (inputName == null) {
						inputName = window.prompt("Well Done!\nYou Got A New High Score!\nEnter Your Name: \n(MAXIMUM OF 20 CHARACTERS)","");
						
						if (inputName.length <= 1) {
							inputName = null;
						}
						
						if (inputName.length > 20) {
							inputName = null;
						}
					}	
					
					
					
                    var ScoreData = {
                        Name: inputName,
                        Score: player.score,
                    }

                    ref.push(ScoreData)
                    location.reload();

                }

                catch(err) {
                     location.reload();
                }
            }, 100);

        }else {
            location.reload();
        }
    }
}

function playerRotate(dir) {
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


function playerDrop() {
    player.pos.y++;
    
    if (colision(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
        dropInterval -= 5;
    }
    
    dropCounter = 0;
}

function fullDrop() {
    while (!colision(arena, player)) {
        player.pos.y++;
    }
    
    if (colision(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
        dropInterval -= 5;

    }
    
    dropCounter = 0;
}


function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    
    if (gameStarted) {
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            playerDrop();
        }

        if (cheat) {
            dropInterval = 1000000000;
        }   

        draw();

    } else {
        titleMenu();
    }
    
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById("score").innerText = player.score;
}


function titleMenu() {
    //title
    context.drawImage(titleImg, 0, 0, 12 ,20);
    
    context.save();
    context.scale(1,1);
    context.textAlign = "center";
    context.font = "1.5px roboto"
    
    context.fillStyle = "black";
    context.fillText("Press Any", 6.1, 13.1);
    context.fillText("Key To Start", 6.1, 14.6);
    
    context.fillStyle = "white";
    context.fillText("Press Any", 6, 13);
    context.fillText("Key To Start", 6, 14.5);
    
    context.restore();
}

const colors = [
    null,
    "#FF0D72",
    "#0DC2FF",
    "#0DFF72",
    "#F538FF",
    "#FF8E0D",
    "#FFE138",
    "#3877FF",
    "#525252",
    
]

const arena = createMatrix(12, 20);

const player = {
    pos: {x: 0,y: 0},
    matrix: null,
    score: 0,
};

var mousekey = false;
var cheatKey = false;

var mouseControl = false;

document.addEventListener("keydown", event => {

    if (gameStarted) {
        if (event.keyCode == 37) {
           playerMove(-1);
       }else if (event.keyCode == 39) {
           playerMove(1);
       }else if (event.keyCode == 40) {
           playerDrop();
       }else if (event.keyCode == 38) {
           playerRotate(1);
       }else if (event.keyCode == 32) {
            fullDrop();

       }else if (event.keyCode == 16) {
           if (cheat) {
               fullDrop();
           }

       }

    }
    
    if (event.keyCode == 16) {
        mousekey = true;
    }
    
    gameStarted = true;
});


document.onmousemove = handleMouseMove;
var MouseX;
var MouseY;
var lastMX = 0;
function handleMouseMove(event) {

	event = event || window.event; // IE-ism
    
	//MouseX = event.pageX;
	//MouseY = event.pageY;
    
    var rect = canvas.getBoundingClientRect()
    
    var scaleX = canvas.width / rect.width;   
    var scaleY = canvas.height / rect.height; 
    
    //MouseX = event.clientX;
    MouseX = Math.abs((event.clientX - rect.left) * scaleX);
    //MouseY = Math.abs((event.clientY - rect.top) * scaleY);
    
    
    if (mouseControl) {
        
        if (MouseX > lastMX + 20) {
            playerMove(1);
            lastMX = MouseX;
            
        } else if (MouseX < lastMX - 20) {
            playerMove(-1);
            lastMX = MouseX;
            
        }
    }
    
}

document.addEventListener("click", event => {
   if (mouseControl) {
       fullDrop();
   }
    
    gameStarted = true;
    
});

document.addEventListener("scroll", event => {
   if (mouseControl) {
       playerRotate(1);
   }
    
});


document.addEventListener("keypress", event => {
    if (event.keyCode == 77 && mousekey) {
        mouseControl = !mouseControl;
    } else if (event.keyCode == 67 && mousekey) {
        cheat = !cheat;
    } else if (event.keyCode == 70 && mousekey) {
        flasher = !flasher;
    } else if (event.keyCode == 71 && mousekey) {
        gridEnabled = !gridEnabled;
    }else if (event.keyCode == 72 && mousekey) {
        guideEnabled = !guideEnabled;
    }
    
});

document.addEventListener("keyup", event => {
   if (event.keyCode == 16) {
       mousekey = false;
   }
    
});


ref.on("value", gotData, errData);

function gotData(data) {
    //remove data
    if (document.getElementById("leaderboardItem") != null) {
        while (document.getElementById("leaderboardItem") != null) {
            var items = document.getElementById("leaderboardItem");
            items.parentNode.removeChild(items);
        }
        HighScores = [];
    }
    
    //add data
    var scores = data.val();
    var keys = Object.keys(scores);
    
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var names = scores[k].Name;
        var dScore = scores[k].Score;
        
        var scData = {
            Score: dScore,
            Name: names,
        };
        
        HighScores.push(scData);

    }
    
    HighScores.sort(function (a, b) {return a.Score - b.Score;});
    //HighScores.sort(HighScores.Score);
    HighScores.reverse();
    
    for (i = 0; i < 15; i++) {
        var li = document.createElement("li");
        var span = document.createElement("span");
        li.innerHTML = HighScores[i].Name;
		span.innerHTML = " " + HighScores[i].Score;
        li.setAttribute("id", "leaderboardItem");
        if (i == 0) {
            li.classList.add("num1");
            li.innerHTML += " " + em1;
        }
        
        if (i == 1) {
            li.classList.add("num2");
            li.innerHTML += " "+ em2;
        }
        
        if (i == 2) {
            li.classList.add("num3");
            li.innerHTML += " "+ em3;
        }
        
        document.getElementById("leaderboard").appendChild(li);
		li.appendChild(span)
    }
}

function errData(err) {
    console.log(err);
}


nextP.push(createPiece(pieces[pieces.length * Math.random() | 0]));
playerReset();
updateScore();
update();




//var firebaseConfig = {
//    apiKey: "AIzaSyBd1GoTHeKlRIF2DKvs-8zBUl5NoYmJugg",
//    authDomain: "tetris-fba18.firebaseapp.com",
//    databaseURL: "https://tetris-fba18.firebaseio.com",
//    projectId: "tetris-fba18",
//    storageBucket: "",
//    messagingSenderId: "730725312624",
//    appId: "1:730725312624:web:96a32a2fcc56dce3"
//  };
//  // Initialize Firebase
//  firebase.initializeApp(firebaseConfig);