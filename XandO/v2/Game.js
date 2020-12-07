class Game {
    constructor(ctx, c, gameMode) {
        this.ctx = ctx;
        this.c = c;
        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        this.player1turn;
        this.gameOver = false;
        this.winner = "";
        this.winnerType = "";
        this.gameMode = gameMode;
        this.gameOverAlpha = 0;
        this.turnCount = 0;
        this.restartButton = new Button(ctx);
        this.btmButton = new Button(ctx);
        
        this.restartButton.setBackground("rgba(255, 255, 255 , 0.5");
        this.restartButton.setHighlight("rgba(255,255,255,0.85)");
        this.restartButton.setOutline("black");
        this.restartButton.setOutlineWidth("4");
        this.restartButton.setText("Play Again");
        this.restartButton.setPos(c.width/2-320, c.height/2-30);
        this.restartButton.setDimentions(300, 150);
        
        this.btmButton.setBackground("rgba(255, 255, 255 , 0.5)");
        this.btmButton.setHighlight("rgba(255,255,255,0.75)");
        this.btmButton.setOutline("black");
        this.btmButton.setOutlineWidth("4");
        this.btmButton.setText("Select Gamemode");
        this.btmButton.setPos(c.width/2+20, c.height/2-30);
        this.btmButton.setDimentions(300, 150);
        
        //starter functions
        this.chooseStarter();
    }
    
    draw() {
        //base
        if (this.gameMode ==2 && this.player1turn) {
            this.ctx.fillStyle = "rgba(41, 173, 255)";
        } else if (this.gameMode == 2 && !this.player1turn) {
            this.ctx.fillStyle = "rgba(255,0,0)";
        } else {
            this.ctx.fillStyle = "rgb(220,220,220)";
        }
        this.ctx.fillRect(0,0,this.c.width, this.c.height);
        
        this.drawBoard(this.c.width/2, this.c.height/2);
    }
    
    drawBoard(ox, oy) {
        //board
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(ox-300, oy-300, 600, 600);
        
        //highlight block
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                let px = (ox+100) - (x * 200);
                let py = (oy+100) - (y * 200);
                if (mouseX > px & mouseX < px + 200 && mouseY > py & mouseY < py + 200 && this.board[y][x] == 0 && !this.gameOver) {
                    this.ctx.fillStyle = "rgb(230,230,230)";
                    this.ctx.fillRect(px, py, 200, 200);
                }
            }
        }
        
        //game over highlight
        if (this.gameOver) {
            this.ctx.fillStyle = "rgb(0,255,0,0.5)";
            
            switch (this.winnerType) {
                case "0-":
                    this.ctx.fillRect(ox-300,oy+100,600,200);
                    break;
                
                case "1-":
                    this.ctx.fillRect(ox-300,oy-100,600,200);
                    break;
                
                case "2-":
                    this.ctx.fillRect(ox-300,oy-300,600,200);
                    break;
                
                
                case "0|":
                    this.ctx.fillRect(ox+100,oy-300,200,600);
                    break;
                
                case "1|":
                    this.ctx.fillRect(ox-100,oy-300,200,600);
                    break;
                
                case "2|":
                    this.ctx.fillRect(ox-300,oy-300,200,600);
                    break;
                    
                
                case "dl":
                    this.ctx.fillRect(ox+100,oy-300,200,200);
                    this.ctx.fillRect(ox-100,oy-100,200,200);
                    this.ctx.fillRect(ox-300,oy+100,200,200);
                    break;
                
                case "dr":
                    this.ctx.fillRect(ox-300,oy-300,200,200);
                    this.ctx.fillRect(ox-100,oy-100,200,200);
                    this.ctx.fillRect(ox+100,oy+100,200,200);
                    break;    
            }
        }
        
        //board lines
        this.ctx.strokeStyle = "black";
        this.ctx.moveTo(ox-300, oy-100); this.ctx.lineTo(ox+300, oy-100);
        this.ctx.moveTo(ox-300, oy+100); this.ctx.lineTo(ox+300, oy+100);
        this.ctx.moveTo(ox-100, oy-300); this.ctx.lineTo(ox-100, oy+300);
        this.ctx.moveTo(ox+100, oy-300); this.ctx.lineTo(ox+100, oy+300);
        this.ctx.stroke();
        this.ctx.strokeRect(ox-300, oy-300, 600, 600);
    
        //board text
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                let px = (ox+100) - (x * 200);
                let py = (oy+100) - (y * 200);
                
                if (this.board[y][x] == "x" || this.board[y][x] == "o") {
                    if (this.board[y][x] == "o") {
                        this.ctx.fillStyle = "#29adff";
                    } else {
                        this.ctx.fillStyle = "red";
                    }
                    this.ctx.textAlign = "center";
                    this.ctx.font = "200px Raleway";
                    this.ctx.fillText(this.board[y][x], px+100, py+155);
                }
            }
        }
        
        //player text
        this.ctx.fillStyle = "black";
        this.ctx.font = "50px Raleway";
        let text = "";
        if (this.player1turn && this.gameMode == 2) {
            text = "Player 1's Turn";
        } else if (this.gameMode == 2) {
            text = "Player 2's Turn";
        }
        this.ctx.fillText(text, this.c.width/2, 150);
        
        //game over ui
        if (this.gameOver) {
            if (this.gameOverAlpha < 90) {
                this.gameOverAlpha += 0.1 * dt;
            }
            
            //black fade
            let g = this.ctx.createLinearGradient(0,0,0,this.c.height);
            g.addColorStop(0, "rgba(0,0,0,0)");
            g.addColorStop(0.35, "rgba(0,0,0," + (this.gameOverAlpha/100) + ")");
            g.addColorStop(0.65, "rgba(0,0,0," + (this.gameOverAlpha/100) + ")");
            g.addColorStop(1, "rgba(0,0,0,0)");
            this.ctx.fillStyle = g;
            //this.ctx.fillStyle = "rgba(0,0,0," + (this.gameOverAlpha/100) +")";
            this.ctx.fillRect(0,0,this.c.width, this.c.height);
            
            //text
            this.ctx.fillStyle = "white";
            this.ctx.font = "70px Raleway";
            if (this.winner == "x") {
                if (this.gameMode == 2) {
                    this.ctx.fillText("Player 2 Wins!", this.c.width/2, this.c.height/2-70);
                } else if (this.gameMode == 1) {
                    this.ctx.fillText("Computer Wins!", this.c.width/2, this.c.height/2-70);
                }
            } else if (this.winner == "o") {
                if (this.gameMode == 2) {
                    this.ctx.fillText("Player 1 Wins!", this.c.width/2, this.c.height/2-70);
                } else if (this.gameMode == 1) {
                    this.ctx.fillText("You Win!", this.c.width/2, this.c.height/2-70);
                }
            } else if (this.winner == "draw") {
                
                this.ctx.fillText("It's A Draw!", this.c.width/2, this.c.height/2-70);
            }
            
            this.restartButton.draw(mouseX, mouseY);
            this.btmButton.draw(mouseX, mouseY);
        }
        
        
        //computer
        if (this.gameMode == 1 && !this.player1turn && !this.gameOver) {
            let move = this.pickTurn();
            
            let iix;
            let iiy;

            //get move index on board
            switch (move) {
                case 0:
                    iix = 0;
                    iiy = 0;
                    break;

                case 1:
                    iix = 1;
                    iiy = 0;
                    break;

                case 2:
                    iix = 2;
                    iiy = 0;
                    break;

                case 3:
                    iix = 0;
                    iiy = 1;
                    break;

                case 4:
                    iix = 1;
                    iiy = 1;
                    break;

                case 5:
                    iix = 2;
                    iiy = 1;
                    break;

                case 6:
                    iix = 0;
                    iiy = 2;
                    break;

                case 7:
                    iix = 1;
                    iiy = 2;
                    break;

                case 8:
                    iix = 2;
                    iiy = 2;
                    break;
            }

            if (this.turnCount == 0) {
                let v1;
                let v2;
                if (Math.random < 0.5) {
                    v1 = 0;
                } else {
                    v1 = 2;
                }
                
                if (Math.random < 0.5) {
                    v2 = 0;
                } else {
                    v2 = 2;
                }
                
                this.board[v1][v2] = "x";
            } else {
                this.board[iiy][iix] = "x";
            }
            //console.log("COMPUTER MOVED TO: ", move, "(" + iix + "," + iiy + ")");
            
            
            this.player1turn = true;
            this.checkBoard();
        }
    }
        
    pickTurn() {
        
        //see if can win
        //check if player about to win
        //place in corner
        //place in middle
        //place random
        
        //test each 9 possible moves
        for(let i = 0; i < 9; i++) {
            let testMove = [[...this.board[0]], [...this.board[1]], [...this.board[2]]];
            let ix;
            let iy;
            
            //get move index on board
            switch (i) {
                case 0:
                    ix = 0;
                    iy = 0;
                    break;
                
                case 1:
                    ix = 1;
                    iy = 0;
                    break;
                
                case 2:
                    ix = 2;
                    iy = 0;
                    break;
                
                case 3:
                    ix = 0;
                    iy = 1;
                    break;
                
                case 4:
                    ix = 1;
                    iy = 1;
                    break;
                
                case 5:
                    ix = 2;
                    iy = 1;
                    break;
                
                case 6:
                    ix = 0;
                    iy = 2;
                    break;
                
                case 7:
                    ix = 1;
                    iy = 2;
                    break;
                    
                case 8:
                    ix = 2;
                    iy = 2;
                    break;
            }
            
            //test the move
            if (testMove[iy][ix] == 0) {
                
                //place test move
                testMove[iy][ix] = "turn";
                
                //check each line
                let lines = [];
                lines.push([testMove[0][0], testMove[0][1], testMove[0][2]]);//-----
                lines.push([testMove[1][0], testMove[1][1], testMove[1][2]]);
                lines.push([testMove[2][0], testMove[2][1], testMove[2][2]]);
                
                lines.push([testMove[0][0], testMove[1][0], testMove[2][0]]);// |
                lines.push([testMove[0][1], testMove[1][1], testMove[2][1]]);// |
                lines.push([testMove[0][2], testMove[1][2], testMove[2][2]]);// |
                
                lines.push([testMove[0][2], testMove[1][1], testMove[2][0]]);// /
                lines.push([testMove[0][0], testMove[1][1], testMove[2][2]]);// \
                
                
                //check if the player blocking move is good
                for (let b = 0; b < lines.length; b++) {
                    let count = {x: 0, turn: 0, o: 0};
                    lines[b].forEach(function(t) { count[t] = (count[t]||0) + 1;});
                    //can win
                    if (count.x == 2 && count.turn == 1) {
                        console.log("COMPUTER: winning move: " + i);
                        return i;
                    }
                    
                    //player block
                    if (count.o == 2 && count.turn == 1) {
                        console.log("COMPUTER: player block: " + i);
                        console.log(lines[b], b, i);
                        return i;
                    }
                }    
            }
        }

        //place in corner if no turn
        let testMove = [[...this.board[0]], [...this.board[1]], [...this.board[2]]];
        
        if (testMove[0][0] == 0) {
            console.log("COMPUTER: corner move 1: " + 0);
            return 0;
        } else if (testMove[2][0] == 0) {
            console.log("COMPUTER: corner move 2: " + 6);
            return 6;
        } else if (testMove[0][2] == 0) {
            console.log("COMPUTER: corner move 3: " + 2);
            return 2;
        } else if (testMove[2][2] == 0) {
            console.log("COMPUTER: corner move 4: " + 8);
            return 8;
        }

        //place in middle if no turn
        if (testMove[1][1] == 0) {
            console.log("COMPUTER: placed in middle: " + 4);
            return 4;
        }
        
        let val = this.getRndInteger(0,8);
        console.log("COMPUTER: random move: " + val);
        return val;

    }
    
    findSpotClicked(ox, oy) {
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                let px = (ox+100) - (x * 200);
                let py = (oy+100) - (y * 200);
                if (mouseX > px & mouseX < px + 200 && mouseY > py & mouseY < py + 200) {
                    let spot = {};
                    spot.x = x;
                    spot.y = y;
                    return spot;
                }
            }
        }
    }
    
    chooseStarter() {
        if (Math.random() < 0.5) {
            this.player1turn = true;
        } else {
            this.player1turn = false;
        }
    }
    
    checkBoard() {
        let ans = "";
        let s1 = this.board[0][0];
        let s2 = this.board[0][1];
        let s3 = this.board[0][2];
        let s4 = this.board[1][0];
        let s5 = this.board[1][1];
        let s6 = this.board[1][2];
        let s7 = this.board[2][0];
        let s8 = this.board[2][1];
        let s9 = this.board[2][2];
        // s1 s2 s3
        // s4 s5 s6
        // s7 s8 s9
        
        if (s1 == "x" && s2 == "x" && s3 == "x" ||
            s1 == "o" && s2 == "o" && s3 == "o") {
            ans = s1;
            this.winnerType = "0-";
            // # # #
            // # # #
            // - - -
            
        } else if (s4 == "x" && s5 == "x" && s6 == "x" ||
                   s4 == "o" && s5 == "o" && s6 == "o") {
            ans = s4;
            this.winnerType = "1-";
            // # # #
            // - - -
            // # # #

        } else if (s7 == "x" && s8 == "x" && s9 == "x" ||
                   s7 == "o" && s8 == "o" && s9 == "o") {
            ans = s7;
            this.winnerType = "2-";
            // - - -
            // # # #
            // # # #
            
        } else if (s1 == "x" && s4 == "x" && s7 == "x" ||
                   s1 == "o" && s4 == "o" && s7 == "o") {
            ans = s1;
            this.winnerType = "0|";
            // # # |
            // # # |
            // # # |

             
            
        } else if (s2 == "x" && s5 == "x" && s8 == "x" ||
                   s2 == "o" && s5 == "o" && s8 == "o") {
            ans = s2;
            this.winnerType = "1|";
            // # | #
            // # | #
            // # | #

             

        } else if (s3 == "x" && s6 == "x" && s9 == "x" ||
                   s3 == "o" && s6 == "o" && s9 == "o") {
            ans = s3;
            this.winnerType = "2|";
            // | # #
            // | # #
            // | # #  
            
        } else if (s3 == "x" && s5 == "x" && s7 == "x" ||
                   s3 == "o" && s5 == "o" && s7 == "o") {
            ans = s3;
            this.winnerType = "dl";
            // # # /
            // # / #
            // / # #
        
        
            
        } else if (s1 == "x" && s5 == "x" && s9 == "x" ||
                   s1 == "o" && s5 == "o" && s9 == "o") {
            ans = s1;
            this.winnerType = "dr";
            // \ # #
            // # \ #
            // # # \
        
        
        

        } else if (s1 != 0 && s2 != 0 && s3 != 0 && s4 != 0 && s5 != 0 && s6 != 0 && s7 != 0 && s8 != 0 && s9 != 0) {
            ans = "draw";
            this.winnerType = "draw";
            // draw
            // - - -
            // - - -
            // - - -
            
        }

        if (ans == "x" || ans == "o" || ans == "draw") {
            this.gameOver = true;
            this.winner = ans;
        } 
    }
    
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
}

//make computer
//text to say if computers turn