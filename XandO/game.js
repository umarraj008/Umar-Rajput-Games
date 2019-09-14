const b1 = document.getElementById("div-1");
const b2 = document.getElementById("div-2");
const b3 = document.getElementById("div-3");
const b4 = document.getElementById("div-4");
const b5 = document.getElementById("div-5");
const b6 = document.getElementById("div-6");
const b7 = document.getElementById("div-7");
const b8 = document.getElementById("div-8");
const b9 = document.getElementById("div-9");

const b1text = document.getElementById("1-text");
const b2text = document.getElementById("2-text");
const b3text = document.getElementById("3-text");
const b4text = document.getElementById("4-text");
const b5text = document.getElementById("5-text");
const b6text = document.getElementById("6-text");
const b7text = document.getElementById("7-text");
const b8text = document.getElementById("8-text");
const b9text = document.getElementById("9-text");
const playerLabel = document.getElementById("player-label");
var PlayerTurn = getRandomInt(1,2);
var message = "";
var win = false;
var b1clicked = false;
var b2clicked = false;
var b3clicked = false;
var b4clicked = false;
var b5clicked = false;
var b6clicked = false;
var b7clicked = false;
var b8clicked = false;
var b9clicked = false;


UpdateLabel();

b1.addEventListener("click", function() {
   if (b1clicked == false) {
       click(b1, b1text);
   }
    b1clicked = true;
});

b2.addEventListener("click", function() {
   if (b2clicked == false) {
       click(b2, b2text);
   }
    b2clicked = true;
});

b3.addEventListener("click", function() {
   if (b3clicked == false) {
       click(b3, b3text);
   }
    b3clicked = true;
});

b4.addEventListener("click", function() {
   if (b4clicked == false) {
       click(b4, b4text);
   }
    b4clicked = true;
});

b5.addEventListener("click", function() {
   if (b5clicked == false) {
       click(b5, b5text);
   }
    b5clicked = true;
});

b6.addEventListener("click", function() {
   if (b6clicked == false) {
       click(b6, b6text);
   }
    b6clicked = true;
});

b7.addEventListener("click", function() {
   if (b7clicked == false) {
       click(b7, b7text);
   }
    b7clicked = true;
});

b8.addEventListener("click", function() {
   if (b8clicked == false) {
       click(b8, b8text);
   }
    b8clicked = true;
});

b9.addEventListener("click", function() {
   if (b9clicked == false) {
       click(b9, b9text);
   }
    b9clicked = true;
});

function click (b, btext)
{
    if (PlayerTurn == 1)
    {
      btext.innerHTML = "X";
      btext.style.textShadow = "0px 6px #a5413d";
      b.style.backgroundColor = "#f44842";
      PlayerTurn = 2;
    }else
    {
      btext.innerHTML = "O";
      b.style.backgroundColor = "#41cdf4";
      btext.style.textShadow = "0px 6px #3e91a8";
      PlayerTurn = 1;
    }
 
 
    //b.style.backgroundColor = "#444444";
    UpdateLabel();
    check();
}

function check()
{
        
    //###
    //---
    //---
    
    if (b1text.innerHTML == "X" && 
        b2text.innerHTML == "X" && 
        b3text.innerHTML == "X")
        {
            turnGreen(b1);
            turnGreen(b2);
            turnGreen(b3);
            message = "Player 1 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    if (b1text.innerHTML == "O" && 
        b2text.innerHTML == "O" && 
        b3text.innerHTML == "O")
        {
            turnGreen(b1);
            turnGreen(b2);
            turnGreen(b3);
            message = "Player 2 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    //---
    //###
    //---
    
    if (b4text.innerHTML == "X" && 
        b5text.innerHTML == "X" && 
        b6text.innerHTML == "X")
        {
            turnGreen(b4);
            turnGreen(b5);
            turnGreen(b6);
            message = "Player 1 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    if (b4text.innerHTML == "O" && 
        b5text.innerHTML == "O" && 
        b6text.innerHTML == "O")
        {
            turnGreen(b4);
            turnGreen(b5);
            turnGreen(b6);
            message = "Player 2 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    //---
    //---
    //###
    
    if (b7text.innerHTML == "X" && 
        b8text.innerHTML == "X" && 
        b9text.innerHTML == "X")
        {
            turnGreen(b7);
            turnGreen(b8);
            turnGreen(b9);
            message = "Player 1 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    if (b7text.innerHTML == "O" && 
        b8text.innerHTML == "O" && 
        b9text.innerHTML == "O")
        {
            turnGreen(b7);
            turnGreen(b8);
            turnGreen(b9);
            message = "Player 2 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    //#--
    //-#-
    //--#
    
    if (b1text.innerHTML == "X" && 
        b5text.innerHTML == "X" && 
        b9text.innerHTML == "X")
        {
            turnGreen(b1);
            turnGreen(b5);
            turnGreen(b9);
            message = "Player 1 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    if (b1text.innerHTML == "O" && 
        b5text.innerHTML == "O" && 
        b9text.innerHTML == "O")
        {
            turnGreen(b1);
            turnGreen(b5);
            turnGreen(b9);
            message = "Player 2 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    //--#
    //-#-
    //#--
    
    if (b3text.innerHTML == "X" && 
        b5text.innerHTML == "X" && 
        b7text.innerHTML == "X")
        {
            turnGreen(b3);
            turnGreen(b5);
            turnGreen(b7);
            message = "Player 1 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    if (b3text.innerHTML == "O" && 
        b5text.innerHTML == "O" && 
        b7text.innerHTML == "O")
        {
            turnGreen(b3);
            turnGreen(b5);
            turnGreen(b7);
            message = "Player 2 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }

    
    //#--
    //#--
    //#--
    
    if (b1text.innerHTML == "X" && 
        b4text.innerHTML == "X" && 
        b7text.innerHTML == "X")
        {
            turnGreen(b1);
            turnGreen(b4);
            turnGreen(b7);
            message = "Player 1 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    if (b1text.innerHTML == "O" && 
        b4text.innerHTML == "O" && 
        b7text.innerHTML == "O")
        {
            turnGreen(b1);
            turnGreen(b4);
            turnGreen(b7);
            message = "Player 2 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    //-#-
    //-#-
    //-#-
    
    if (b2text.innerHTML == "X" && 
        b5text.innerHTML == "X" && 
        b8text.innerHTML == "X")
        {
            turnGreen(b2);
            turnGreen(b5);
            turnGreen(b8);
            message = "Player 1 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    if (b2text.innerHTML == "O" && 
        b5text.innerHTML == "O" && 
        b8text.innerHTML == "O")
        {
            turnGreen(b2);
            turnGreen(b5);
            turnGreen(b8);
            message = "Player 2 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    //--#
    //--#
    //--#
    
    if (b3text.innerHTML == "X" && 
        b6text.innerHTML == "X" && 
        b9text.innerHTML == "X")
        {
            turnGreen(b3);
            turnGreen(b6);
            turnGreen(b9);
            message = "Player 1 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
    if (b3text.innerHTML == "O" && 
        b6text.innerHTML == "O" && 
        b9text.innerHTML == "O")
        {
            turnGreen(b3);
            turnGreen(b6);
            turnGreen(b9);
            message = "Player 2 Wins!";
            window.setTimeout(GameOver, 500);
            win = true;
        }
    
   if (win == false) { 
       if ((b1text.innerHTML == "X" || b1text.innerHTML == "O") && 
           (b2text.innerHTML == "X" || b2text.innerHTML == "O") && 
            (b3text.innerHTML == "X" || b3text.innerHTML == "O") && 
            (b4text.innerHTML == "X" || b4text.innerHTML == "O") && 
            (b5text.innerHTML == "X" || b5text.innerHTML == "O") && 
            (b6text.innerHTML == "X" || b6text.innerHTML == "O") && 
            (b7text.innerHTML == "X" || b7text.innerHTML == "O") && 
            (b8text.innerHTML == "X" || b8text.innerHTML == "O") && 
            (b9text.innerHTML == "X" || b9text.innerHTML == "O"))
       {
            turnGreen(b1);
            turnGreen(b2);
            turnGreen(b3);
            turnGreen(b4);
            turnGreen(b5);
            turnGreen(b6);
            turnGreen(b7);
            turnGreen(b8);
            turnGreen(b9);
            message = "Draw!";
            window.setTimeout(GameOver, 500);
        }
   }
}


function GameOver()
{
    document.location.reload(true);
    alert(message);
}

function UpdateLabel()
{
    playerLabel.innerHTML = "Player " + PlayerTurn + " Turn";
    if (PlayerTurn == 1) {
        playerLabel.style.backgroundColor = "#f44842";
        document.body.style.background = "#c6443f";
        
        document.getElementById("player-label").style.textShadow = "0px 5px #c6443f";
        document.getElementById("Xlogo").style.textShadow = "0px 4px #a5413d";
        document.getElementById("Ologo").style.textShadow = "0px 4px #a5413d";
        document.getElementById("Xtext").style.textShadow = "0px 4px #a5413d";
        document.getElementById("Otext").style.textShadow = "0px 4px #a5413d";
        document.getElementById("jeff").style.backgroundColor = "#b2413c";
    }
    
     if (PlayerTurn == 2) {
        playerLabel.style.backgroundColor = "#41cdf4";
        document.body.style.background = "#3fa9c6";
         
        document.getElementById("player-label").style.textShadow = "0px 5px #3fa9c6";
        document.getElementById("Xlogo").style.textShadow = "0px 4px #3e91a8";
        document.getElementById("Ologo").style.textShadow = "0px 4px #3e91a8";
        document.getElementById("Xtext").style.textShadow = "0px 4px #3e91a8";
        document.getElementById("Otext").style.textShadow = "0px 4px #3e91a8";
        document.getElementById("jeff").style.backgroundColor = "#3f9fba";

     }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function turnGreen(b)
{
    b.style.backgroundColor = "#32ff7a";
}