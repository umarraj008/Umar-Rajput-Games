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
        this.canContinue = true;
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
        console.clear();
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
                    this.ctx.font = "200px Roboto";
                    this.ctx.fillText(this.board[y][x], px+100, py+155);
                }
            }
        }
        
        //player text
        this.ctx.fillStyle = "black";
        this.ctx.font = "50px Roboto";
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
            this.ctx.font = "70px Roboto";
            if (this.winner == "x") {
                if (this.gameMode == 2) {
                    this.ctx.fillText("Player 2 Wins!", this.c.width/2, this.c.height/2-70);
                } else if (this.gameMode == 1) {
                    this.ctx.fillText("Computer Wins!", this.c.width/2, this.c.height/2-70);
                } else if (this.gameMode == 3 || this.gameMode == 4) {
                    this.ctx.fillText("Computer 2 Wins!", this.c.width/2, this.c.height/2-70);
                }
            } else if (this.winner == "o") {
                if (this.gameMode == 2) {
                    this.ctx.fillText("Player 1 Wins!", this.c.width/2, this.c.height/2-70);
                } else if (this.gameMode == 1) {
                    this.ctx.fillText("You Win!", this.c.width/2, this.c.height/2-70);
                } else if (this.gameMode == 3 || this.gameMode == 4) {
                    this.ctx.fillText("Computer 1 Win!", this.c.width/2, this.c.height/2-70);
                }
            } else if (this.winner == "draw") {
                
                this.ctx.fillText("It's A Draw!", this.c.width/2, this.c.height/2-70);
            }
            
            this.restartButton.draw(mouseX, mouseY);
            this.btmButton.draw(mouseX, mouseY);
        }
        
        
        //computer gamemode 1
        if (this.gameMode == 1 && !this.player1turn && !this.gameOver) {
            let moveSet = this.pickTurn();
            let move = null;
             
            console.log("COMPUTER: " + moveSet.length + " MOVES CALCULATED");
            
            let count = {win: 0, block: 0, corner: 0, middle: 0, side: 0};
            for (let i = 0; i < moveSet.length; i++) {
                if (moveSet[i].type == "win") {
                    count.win++;
                } else if (moveSet[i].type == "block") {
                    count.block++;
                } else if (moveSet[i].type == "corner") {
                    count.corner++;
                } else if (moveSet[i].type == "middle") {
                    count.middle++;
                } else if (moveSet[i].type == "side") {
                    count.side++;
                } 
            }
            
            if (count.win >= 1) {
                move = "win";
            } else if (count.block >= 1) {
                move = "block";
            } else if (count.corner >= 1) {
                move = "corner";
            } else if (count.middle >= 1) {
                move = "middle";
            } else if (count.side >= 1) {
                move = "side";
            }
            
            for (let i = 0; i < moveSet.length; i++) {
                if (moveSet[i].type == move) {
                    move = moveSet[i].mov;
                    break;
                }
            }
            
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

//            if (this.turnCount == 0) {
//                let v1;
//                let v2;
//                if (Math.random < 0.5) {
//                    v1 = 0;
//                } else {
//                    v1 = 2;
//                }
//                
//                if (Math.random < 0.5) {
//                    v2 = 0;
//                } else {
//                    v2 = 2;
//                }
//                
//                this.board[v1][v2] = "x";
//            } else {
//                this.board[iiy][iix] = "x";
//            }
            //console.log("COMPUTER MOVED TO: ", move, "(" + iix + "," + iiy + ")");
            
            
            this.board[iiy][iix] = "x";
            this.player1turn = true;
            this.checkBoard();
        }
        
        //computer gamemode 3 o
        if ((this.gameMode == 3 || this.gameMode == 4) && this.player1turn && !this.gameOver && this.canContinue) {
            let moveSet = this.pickTurn2();
            let move = null;
             
            console.log("COMPUTER O: " + moveSet.length + " MOVES CALCULATED");
            
            let count = {win: 0, block: 0, corner: 0, middle: 0, side: 0};
            for (let i = 0; i < moveSet.length; i++) {
                if (moveSet[i].type == "win") {
                    count.win++;
                } else if (moveSet[i].type == "block") {
                    count.block++;
                } else if (moveSet[i].type == "corner") {
                    count.corner++;
                } else if (moveSet[i].type == "middle") {
                    count.middle++;
                } else if (moveSet[i].type == "side") {
                    count.side++;
                } 
            }
            
            if (count.win >= 1) {
                move = "win";
            } else if (count.block >= 1) {
                move = "block";
            } else if (count.corner >= 1) {
                move = "corner";
            } else if (count.middle >= 1) {
                move = "middle";
            } else if (count.side >= 1) {
                move = "side";
            }
            
            for (let i = 0; i < moveSet.length; i++) {
                if (moveSet[i].type == move) {
                    move = moveSet[i].mov;
                    break;
                }
            }
            
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
            this.turnCount++;
            if (this.gameMode == 3) {
                this.canContinue = false;
            }
            this.board[iiy][iix] = "o";
            this.player1turn = false;
            this.checkBoard();
        }
     
        //computer gamemode 3 x
        if ((this.gameMode == 3 || this.gameMode == 4) && !this.player1turn && !this.gameOver && this.canContinue) {
            let moveSet = this.pickTurn();
            let move = null;
            console.log("COMPUTER X: " + moveSet.length + " MOVES CALCULATED");
            
            let count = {win: 0, block: 0, corner: 0, middle: 0, side: 0};
            for (let i = 0; i < moveSet.length; i++) {
                if (moveSet[i].type == "win") {
                    count.win++;
                } else if (moveSet[i].type == "block") {
                    count.block++;
                } else if (moveSet[i].type == "corner") {
                    count.corner++;
                } else if (moveSet[i].type == "middle") {
                    count.middle++;
                } else if (moveSet[i].type == "side") {
                    count.side++;
                } 
            }
            
            if (count.win >= 1) {
                move = "win";
            } else if (count.block >= 1) {
                move = "block";
            } else if (count.corner >= 1) {
                move = "corner";
            } else if (count.middle >= 1) {
                move = "middle";
            } else if (count.side >= 1) {
                move = "side";
            }
            
            for (let i = 0; i < moveSet.length; i++) {
                if (moveSet[i].type == move) {
                    move = moveSet[i].mov;
                    break;
                }
            }
            
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
            this.turnCount++;
            if (this.gameMode == 3) {
                this.canContinue = false;
            }
            this.board[iiy][iix] = "x";
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
        
        var moves = [];
        
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
                        //console.log("COMPUTER: winning move: " + i);
                        moves.push({type: "win", mov: i});
                    }
                    
                    //player block
                    if (count.o == 2 && count.turn == 1) {
                        //console.log("COMPUTER: player block: " + i);
                        moves.push({type: "block", mov: i});
                    }
                }    
            }
        }

        //place in corner if no turn
        let testMove = [[...this.board[0]], [...this.board[1]], [...this.board[2]]];
        
        if (testMove[0][0] == 0) {
            //console.log("COMPUTER: corner move 1: " + 0);
            moves.push({type: "corner", mov: 0});
        }
        
        if (testMove[2][0] == 0) {
            //console.log("COMPUTER: corner move 2: " + 6);
            moves.push({type: "corner", mov: 6});
        }
        
        if (testMove[0][2] == 0) {
            //console.log("COMPUTER: corner move 3: " + 2);
            moves.push({type: "corner", mov: 2});
        }
        
        if (testMove[2][2] == 0) {
            //console.log("COMPUTER: corner move 4: " + 8);
            moves.push({type: "corner", mov: 8});
        }

        //place in middle if no turn
        if (testMove[1][1] == 0) {
            //console.log("COMPUTER: placed in middle: " + 4);
            moves.push({type: "middle", mov: 4});
        }
        
        
        if (testMove[0][1] == 0) {
            //console.log("COMPUTER: placed in middle: " + 4);
            moves.push({type: "side", mov: 1});
        }
        
        if (testMove[1][0] == 0) {
            //console.log("COMPUTER: placed in middle: " + 4);
            moves.push({type: "side", mov: 3});
        }
        
        if (testMove[1][2] == 0) {
            //console.log("COMPUTER: placed in middle: " + 4);
            moves.push({type: "side", mov: 5});
        }
        
        if (testMove[2][1] == 0) {
            //console.log("COMPUTER: placed in middle: " + 4);
            moves.push({type: "side", mov: 7});
        }
        
        return moves;
    }
    
    
    pickTurn2() {
        
        //see if can win
        //check if player about to win
        //place in corner
        //place in middle
        //place random
        
        var moves = [];
        
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
                    if (count.o == 2 && count.turn == 1) {
                        //console.log("COMPUTER: winning move: " + i);
                        moves.push({type: "win", mov: i});
                    }
                    
                    //player block
                    if (count.x == 2 && count.turn == 1) {
                        //console.log("COMPUTER: player block: " + i);
                        moves.push({type: "block", mov: i});
                    }
                }    
            }
        }

        //place in corner if no turn
        let testMove = [[...this.board[0]], [...this.board[1]], [...this.board[2]]];
        
        if (testMove[0][0] == 0) {
            //console.log("COMPUTER: corner move 1: " + 0);
            moves.push({type: "corner", mov: 0});
        }
        
        if (testMove[2][0] == 0) {
            //console.log("COMPUTER: corner move 2: " + 6);
            moves.push({type: "corner", mov: 6});
        }
        
        if (testMove[0][2] == 0) {
            //console.log("COMPUTER: corner move 3: " + 2);
            moves.push({type: "corner", mov: 2});
        }
        
        if (testMove[2][2] == 0) {
            //console.log("COMPUTER: corner move 4: " + 8);
            moves.push({type: "corner", mov: 8});
        }

        //place in middle if no turn
        if (testMove[1][1] == 0) {
            //console.log("COMPUTER: placed in middle: " + 4);
            moves.push({type: "middle", mov: 4});
        }
        
        
        if (testMove[0][1] == 0) {
            //console.log("COMPUTER: placed in middle: " + 4);
            moves.push({type: "side", mov: 1});
        }
        
        if (testMove[1][0] == 0) {
            //console.log("COMPUTER: placed in middle: " + 4);
            moves.push({type: "side", mov: 3});
        }
        
        if (testMove[1][2] == 0) {
            //console.log("COMPUTER: placed in middle: " + 4);
            moves.push({type: "side", mov: 5});
        }
        
        if (testMove[2][1] == 0) {
            //console.log("COMPUTER: placed in middle: " + 4);
            moves.push({type: "side", mov: 7});
        }
        
        return moves;
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