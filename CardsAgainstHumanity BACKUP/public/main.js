const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
let lastTime = 0;

var dt;
var connected = false;
var players = [];
var choice = null;
var me = {
    id: null,
    name: null,
    cards: [
        {card_val: ""}, 
        {card_val: ""}, 
        {card_val: ""}, 
        {card_val: ""}, 
        {card_val: ""}, 
        {card_val: ""}, 
        {card_val: ""}, 
        {card_val: ""}, 
        {card_val: ""}, 
        {card_val: ""}, 
    ],
    score: 0,
};
var currentQ = "";
var tv_Mode = false;
var selectable = false;
var display_answers = [];
var show_the_answers = false;
var card_regions = [
    {x: 2, y: 698,w: 189, h:384},
    {x: 194, y: 698,w: 189, h:384},
    {x: 386, y: 698,w: 189, h: 384},
    {x: 578, y: 698,w: 189, h: 384},
    {x: 770, y: 698,w: 189, h: 384},
    {x: 962, y: 698,w: 189, h: 384},
    {x: 1154, y: 698,w: 189, h: 384},
    {x: 1346, y: 698,w: 189, h: 384},
    {x: 1538, y: 698,w: 189, h: 384},
    {x: 1730, y: 698,w: 189, h: 384},
];
var menuShow = false;
var show = {
    f: false, 
    s: false, 
    t: false,
    final: false,
    counter: 0,
    opacity: 0,
    textTime: 500,
    fadeIN: true,
}

var buttons = {
       	ATV: {x: 50, y: 50, w: 573, h: 980, over: false, color: "rgba(128, 14, 62, 1)", highcolor: "rgb(52, 143, 235)", text: {string: "Activate TV", color: "white", size: "50px", xOff: 0, yOff: 20}},
	
        SG: {x: 673, y: 50, w: 573, h: 980, over: false, color: "rgba(128, 14, 62, 1)", highcolor: "rgb(52, 143, 235)", text: {string: "Start Game", color: "white", size: "50px", xOff: 0, yOff: 20}},
        
        NR: {x: 1296, y: 50, w: 573, h: 980, over: false, color: "rgba(128, 14, 62, 1)", highcolor: "rgb(52, 143, 235)", text: {string: "New Round", color: "white", size: "50px", xOff: 0, yOff: 20}},

}

function draw() {
    //base
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, c.width, c.height);
    
    
    //CONNECTED OR NOT
    if (!tv_Mode) {
        if (!socket.connected) {
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.font = "110px roboto"
            ctx.fillText("Not Connected", c.width / 2, c.height / 2);

           // ctx.fillRect(0,0,50,50);
        }
    }
    
    
    
    
    
    
    //TV MODE
    if (tv_Mode) {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "80px roboto"
        ctx.fillText("Cards Against Humanity", c.width / 2, 100); //TV MODE TEXT
        
        
        //question
//        ctx.fillStyle = "white";
//        ctx.textAlign = "center";
//        ctx.font = "110px roboto"
//        ctx.fillText(currentQ, c.width / 2, 300);
        
        
        //question
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "110px roboto"

        var ques = null; ////replace q with currentQ
        var qy = 300;

        if (currentQ.includes("/")) {
            ques = currentQ.split("/");
        }

        if (ques != null) {
            for (i = 0; i < ques.length; i++) {
                ctx.fillText(ques[i], c.width / 2, qy);
                qy+=120;
            }
        } else {
            ctx.fillText(currentQ, c.width / 2, 400);
        }
        
        if (show_the_answers) {
            
//            //CARD 1
//            ctx.fillStyle = "white";
//            ctx.fillRect(0, 0 ,200, 400);
//            ctx.fillStyle = "red";
//            ctx.textAlign = "center";
//            ctx.font = "50px roboto"
//            ctx.fillText(display_answers[0].card_val, 100, 200);
//
//            //CARD 2
//            ctx.fillStyle = "lime";
//            ctx.fillRect(300, 0 ,200, 400);
//            ctx.fillStyle = "red";
//            ctx.textAlign = "center";
//            ctx.font = "50px roboto"
//            ctx.fillText(display_answers[1].card_val, 400, 200);
//
//            //CARD 3
//            ctx.fillStyle = "blue";
//            ctx.fillRect(600, 0 ,200, 400);
//            ctx.fillStyle = "red";
//            ctx.textAlign = "center";
//            ctx.font = "50px roboto"
//            ctx.fillText(display_answers[2].card_val, 700, 200);
        
            if (show.f) {
                show.counter++;
                
                if (show.fadeIN) {
                    show.opacity++;
                    
                    
                    if (show.opacity >= 100) {
                        show.fadeIN = false;
                    }
                }
                
                ctx.fillStyle = "rgba(255,255,255," + (show.opacity / 100) + ")";
                //ctx.fillText(display_answers[0].card_val, c.width/2, 900);
                
                var ques5 = null; ////replace q with currentQ
                var qy5 = 900;

                if (display_answers[0].card_val.includes("/")) {
                    ques5 = display_answers[0].card_val.split("/");
                }

                if (ques5 != null) {
                    for (i = 0; i < ques5.length; i++) {
                        ctx.fillText(ques5[i], c.width / 2, qy5);
                        qy5+=60;
                    }
                } else {
                    ctx.fillText(display_answers[0].card_val, c.width / 2, 900);
                }
                
                
                if (show.counter > show.textTime) {
                    show.opacity--;
                    
                    if (show.opacity <= 0) {
                        show.f = false;
                        show.counter = 0;
                        show.opacity = 0;
                        show.fadeIN = true;
                        
                        show.s = true;
                    }
                    
                }
                
                
            }
            
            if (show.s) {
                show.counter++;
                
                if (show.fadeIN) {
                    show.opacity++;
                    
                    
                    if (show.opacity >= 100) {
                        show.fadeIN = false;
                    }
                }
                
                ctx.fillStyle = "rgba(255,255,255," + (show.opacity / 100) + ")";
                //ctx.fillText(display_answers[1].card_val, c.width/2, 900);
                
                var ques6 = null; ////replace q with currentQ
                var qy6 = 900;

                if (display_answers[1].card_val.includes("/")) {
                    ques6 = display_answers[1].card_val.split("/");
                }

                if (ques6 != null) {
                    for (i = 0; i < ques6.length; i++) {
                        ctx.fillText(ques6[i], c.width / 2, qy6);
                        qy6+=60;
                    }
                } else {
                    ctx.fillText(display_answers[1].card_val, c.width / 2, 900);
                }
                
                
                if (show.counter > show.textTime) {
                    show.opacity--;
                    
                    if (show.opacity <= 0) {
                        show.s = false;
                        show.counter = 0;
                        show.opacity = 0;
                        show.fadeIN = true;
                        
                        show.t = true;
                    }
                    
                }
                
                
            }
            
            if (show.t) {
                show.counter++;
                
                if (show.fadeIN) {
                    show.opacity++;
                    
                    
                    if (show.opacity >= 100) {
                        show.fadeIN = false;
                    }
                }
                
                ctx.fillStyle = "rgba(255,255,255," + (show.opacity / 100) + ")";
                //ctx.fillText(display_answers[2].card_val, c.width/2, 900);
                
                var ques7 = null; ////replace q with currentQ
                var qy7 = 900;

                if (display_answers[2].card_val.includes("/")) {
                    ques7 = display_answers[2].card_val.split("/");
                }

                if (ques7 != null) {
                    for (i = 0; i < ques7.length; i++) {
                        ctx.fillText(ques7[i], c.width / 2, qy7);
                        qy7+=60;
                    }
                } else {
                    ctx.fillText(display_answers[2].card_val, c.width / 2, 900);
                }
                
                
                if (show.counter > show.textTime) {
                    show.opacity--;
                    
                    if (show.opacity <= 0) {
                        show.t = false;
                        show.counter = 0;
                        show.opacity = 0;
                        show.fadeIN = true;
                        
                        show.final = true;
                    }
                    
                }
                
                
            }
            
            if (show.final) {
                show.counter++;
                
                if (show.fadeIN) {
                    show.opacity++;
                    
                    
                    if (show.opacity >= 100) {
                        show.fadeIN = false;
                    }
                }
                
//                //CARD 1
//                ctx.fillStyle = "rgba(255,255,255," + (show.opacity / 100) +")";
//                ctx.fillRect(0, 0 ,200, 400);
//                ctx.fillStyle = "rgba(255,0,0," + (show.opacity / 100) +")";
//                ctx.textAlign = "center";
//                ctx.font = "50px roboto"
//                ctx.fillText(display_answers[0].card_val, 100, 200);
//
//                //CARD 2
//                ctx.fillStyle = "rgba(255,255,255," + (show.opacity / 100) +")";
//                ctx.fillRect(300, 0 ,200, 400);
//                ctx.fillStyle = "rgba(255,0,0," + (show.opacity / 100) +")";
//                ctx.textAlign = "center";
//                ctx.font = "50px roboto"
//                ctx.fillText(display_answers[1].card_val, 400, 200);
//
//                //CARD 3
//                ctx.fillStyle = "rgba(255,255,255," + (show.opacity / 100) +")";
//                ctx.fillRect(600, 0 ,200, 400);
//                ctx.fillStyle = "rgba(255,0,0," + (show.opacity / 100) +")";
//                ctx.textAlign = "center";
//                ctx.font = "50px roboto"
//                ctx.fillText(display_answers[2].card_val, 700, 200);
                
                
                
                
                //ctx.fillText(display_answers[0].card_val, c.width / 2 - 700, 900);
                //ctx.fillText(display_answers[1].card_val, c.width / 2, 900);
                //ctx.fillText(display_answers[2].card_val, c.width / 2 + 700, 900);
                
                
                //display_answers =  [{card_val: "testing the answers that /are shown within the context"},{card_val: "testing the answers/ that are shown within the context"},{card_val: "testing the answers/ that are shown within the context"},]
                
                //CARDS
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.font = "50px roboto"
                
                ///// CARD 1 /////
                var ques2 = null; ////replace q with currentQ
                var qy2 = 900;

                if (display_answers[0].card_val.includes("/")) {
                    ques2 = display_answers[0].card_val.split("/");
                }

                if (ques2 != null) {
                    for (i = 0; i < ques2.length; i++) {
                        ctx.fillText(ques2[i], c.width / 2 - 700, qy2);
                        qy2+=60;
                    }
                } else {
                    ctx.fillText(display_answers[0].card_val, c.width / 2 - 700, 900);
                }
                
                ///// CARD 2 ///////
                var ques3 = null; ////replace q with currentQ
                var qy3 = 900;

                if (display_answers[1].card_val.includes("/")) {
                    ques3 = display_answers[1].card_val.split("/");
                }

                if (ques3 != null) {
                    for (i = 0; i < ques3.length; i++) {
                        ctx.fillText(ques3[i], c.width / 2, qy3);
                        qy3+=60;
                    }
                } else {
                    ctx.fillText(display_answers[1].card_val, c.width / 2, 900);
                }
                
                //// CARD 3 /////
                var ques4 = null; ////replace q with currentQ
                var qy4 = 900;

                if (display_answers[2].card_val.includes("/")) {
                    ques4= display_answers[2].card_val.split("/");
                }

                if (ques4 != null) {
                    for (i = 0; i < ques4.length; i++) {
                        ctx.fillText(ques4[i], c.width / 2 + 700, qy4);
                        qy4+=60;
                    }
                } else {
                    ctx.fillText(display_answers[2].card_val, c.width / 2 + 700, 900);
                }
    
                
                
            }
        
            
            
        }
        
        
                
        
        
    } else {
        

        ctx.fillStyle = "white"
        
        ctx.textAlign = "center";
        ctx.font = "150px roboto";
        ctx.fillText("Cards Against Humanity", c.width / 2, 200);
        
        if (selectable) {
            ctx.fillStyle = "white";
        } else {
            ctx.fillStyle = "black";
            
            
            
        }
        //CARD WHITE BORDER
        ctx.fillRect(0,696,192,384);
        ctx.fillRect(192,696,192,384);
        ctx.fillRect(384,696,192,384);
        ctx.fillRect(576,696,192,384);
        ctx.fillRect(768,696,192,384);
        ctx.fillRect(960,696,192,384);
        ctx.fillRect(1152,696,192,384);
        ctx.fillRect(1344,696,192,384);
        ctx.fillRect(1536,696,192,384);
        ctx.fillRect(1728,696,192,384);
        
        
        //CARD BLACK MAIN FILL
        ctx.fillStyle = "black";
        ctx.fillRect(2,698,189,384);
        ctx.fillRect(194,698,189,384);
        ctx.fillRect(386,698,189,384);
        ctx.fillRect(578,698,189,384);
        ctx.fillRect(770,698,189,384);
        ctx.fillRect(962,698,189,384);
        ctx.fillRect(1154,698,189,384);
        ctx.fillRect(1346,698,189,384);
        ctx.fillRect(1538,698,189,384);
        ctx.fillRect(1730,698,189,384);
        
        
        var textGap = 30;
        
        //CARD TEXT
        if (selectable) {
            ctx.font = "20px roboto";
            ctx.fillStyle = "white"
            
            //TEXT 1
            var ques = null; ////replace q with currentQ
            var qy = 0;

            if (me.cards[0].card_val.includes("/")) {
                ques = me.cards[0].card_val.split("/");
            }

            if (ques != null) {
                for (i = 0; i < ques.length; i++) {
                    ctx.fillText(ques[i], 2 + (192 / 2),698 + (384 / 2) + qy);
                    qy+=textGap;
                }
            } else {
                ctx.fillText(me.cards[0].card_val, 2 + (192 / 2),698 + (384 / 2));
            }
            
            
            //TEXT 2
            var ques2 = null; ////replace q with currentQ
            var qy2 = 0;

            if (me.cards[1].card_val.includes("/")) {
                ques2 = me.cards[1].card_val.split("/");
            }

            if (ques2 != null) {
                for (i = 0; i < ques2.length; i++) {
                    ctx.fillText(ques2[i], 194 + (192 / 2),698 + (384 / 2) + qy2);
                    qy2+=textGap;
                }
            } else {
                ctx.fillText(me.cards[1].card_val, 194 + (192 / 2),698 + (384 / 2));
            }
            
            
            //TEXT 3
            var ques3 = null; ////replace q with currentQ
            var qy3 = 0;

            if (me.cards[2].card_val.includes("/")) {
                ques3 = me.cards[2].card_val.split("/");
            }

            if (ques3 != null) {
                for (i = 0; i < ques3.length; i++) {
                    ctx.fillText(ques3[i], 386 + (192 / 2),698 + (384 / 2) + qy3);
                    qy3+=textGap;
                }
            } else {
                ctx.fillText(me.cards[2].card_val, 386 + (192 / 2),698 + (384 / 2));
            }
            
            //TEXT 4
            var ques4 = null; ////replace q with currentQ
            var qy4 = 0;

            if (me.cards[3].card_val.includes("/")) {
                ques4 = me.cards[3].card_val.split("/");
            }

            if (ques4 != null) {
                for (i = 0; i < ques4.length; i++) {
                    ctx.fillText(ques4[i], 578 + (192 / 2),698 + (384 / 2) + qy4);
                    qy4+=textGap;
                }
            } else {
                ctx.fillText(me.cards[3].card_val, 578 + (192 / 2),698 + (384 / 2));
            }
            
            //TEXT 5
            var ques5 = null; ////replace q with currentQ
            var qy5 = 0;

            if (me.cards[4].card_val.includes("/")) {
                ques5 = me.cards[4].card_val.split("/");
            }

            if (ques5 != null) {
                for (i = 0; i < ques5.length; i++) {
                    ctx.fillText(ques5[i], 770 + (192 / 2),698 + (384 / 2) + qy5);
                    qy5+=textGap;
                }
            } else {
                ctx.fillText(me.cards[4].card_val, 770 + (192 / 2),698 + (384 / 2));
            }
            
            //TEXT 6
            var ques6 = null; ////replace q with currentQ
            var qy6 = 0;

            if (me.cards[5].card_val.includes("/")) {
                ques6 = me.cards[5].card_val.split("/");
            }

            if (ques6 != null) {
                for (i = 0; i < ques6.length; i++) {
                    ctx.fillText(ques6[i], 962 + (192 / 2),698 + (384 / 2) + qy6);
                    qy6+=textGap;
                }
            } else {
                ctx.fillText(me.cards[5].card_val, 962 + (192 / 2),698 + (384 / 2));
            }
            
            //TEXT 7
            var ques7 = null; ////replace q with currentQ
            var qy7 = 0;

            if (me.cards[6].card_val.includes("/")) {
                ques7 = me.cards[6].card_val.split("/");
            }

            if (ques7 != null) {
                for (i = 0; i < ques7.length; i++) {
                    ctx.fillText(ques7[i], 1154 + (192 / 2),698 + (384 / 2) + qy7);
                    qy7+=textGap;
                }
            } else {
                ctx.fillText(me.cards[6].card_val, 1154 + (192 / 2),698 + (384 / 2));
            }
            
            //TEXT 8
            var ques8 = null; ////replace q with currentQ
            var qy8 = 0;

            if (me.cards[7].card_val.includes("/")) {
                ques8 = me.cards[7].card_val.split("/");
            }

            if (ques8 != null) {
                for (i = 0; i < ques8.length; i++) {
                    ctx.fillText(ques8[i], 1346 + (192 / 2),698 + (384 / 2) + qy8);
                    qy8+=textGap;
                }
            } else {
                ctx.fillText(me.cards[7].card_val, 1346 + (192 / 2),698 + (384 / 2));
            }
            
            //TEXT 9
            var ques9 = null; ////replace q with currentQ
            var qy9 = 0;

            if (me.cards[8].card_val.includes("/")) {
                ques9 = me.cards[8].card_val.split("/");
            }

            if (ques9 != null) {
                for (i = 0; i < ques9.length; i++) {
                    ctx.fillText(ques9[i], 1538 + (192 / 2),698 + (384 / 2) + qy9);
                    qy9+=textGap;
                }
            } else {
                ctx.fillText(me.cards[8].card_val, 1538 + (192 / 2),698 + (384 / 2));
            }
            
            //TEXT 10
            var ques11 = null; ////replace q with currentQ
            var qy11 = 0;

            if (me.cards[9].card_val.includes("/")) {
                ques11 = me.cards[9].card_val.split("/");
            }

            if (ques11 != null) {
                for (i = 0; i < ques11.length; i++) {
                    ctx.fillText(ques11[i], 1730 + (192 / 2),698 + (384 / 2) + qy11);
                    qy11+=textGap;
                }
            } else {
                ctx.fillText(me.cards[9].card_val, 1730 + (192 / 2),698 + (384 / 2));
            }
            
            
            //ctx.fillText(me.cards[0].card_val, 2 + (192 / 2),698 + (384 / 2));
            //ctx.fillText(me.cards[1].card_val, 194 + (192 / 2),698 + (384 / 2));
            //ctx.fillText(me.cards[2].card_val, 386 + (192 / 2),698 + (384 / 2));
            //ctx.fillText(me.cards[3].card_val, 578 + (192 / 2),698 + (384 / 2));
            //ctx.fillText(me.cards[4].card_val, 770 + (192 / 2),698 + (384 / 2));
            //ctx.fillText(me.cards[5].card_val, 962 + (192 / 2),698 + (384 / 2));
            //ctx.fillText(me.cards[6].card_val, 1154 + (192 / 2),698 + (384 / 2));
            //ctx.fillText(me.cards[7].card_val, 1346 + (192 / 2),698 + (384 / 2));
            //ctx.fillText(me.cards[8].card_val, 1538 + (192 / 2),698 + (384 / 2));
            //ctx.fillText(me.cards[9].card_val, 1730 + (192 / 2),698 + (384 / 2));
        }
        
    }
    
    
    
    
    
    
    
}


function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;
    
    
    
    if (menuShow) {
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.fillRect(0,0,c.width,c.height);
        
        drawBorderButton(buttons.ATV);
        drawBorderButton(buttons.SG);
        drawBorderButton(buttons.NR);
        
    } else {
        draw();
    }
    requestAnimationFrame(update);
}




document.onmousemove = handleMouseMove;
var mouse = {x: 0, y:0};
function handleMouseMove(event) {

	event = event || window.event; // IE-ism
    
	//MouseX = event.pageX;
	//MouseY = event.pageY;
    
    var rect = canvas.getBoundingClientRect()
    
    var scaleX = canvas.width / rect.width;   
    var scaleY = canvas.height / rect.height; 
    
    mouse.x = Math.abs((event.clientX - rect.left) * scaleX);
    mouse.y = Math.abs((event.clientY - rect.top) * scaleY);
    
    buttonHighlight(buttons.ATV, mouse.x, mouse.y);
    buttonHighlight(buttons.SG, mouse.x, mouse.y);
    buttonHighlight(buttons.NR, mouse.x, mouse.y);
    
    
}


var key1 = false;
//INPUT
document.addEventListener("keydown", event => {
    if (event.keyCode == 16) {
        key1 = true;
    }
    
    if (event.keyCode == 84 && key1) {
        activateTV();
    }
    
    if (event.keyCode == 77) {
        menuShow = !menuShow;
        
    }
    
//    if (event.keyCode == 37) {
//        si--
//    }else if (event.keyCode == 39) {
//        si++
//    }
    
});

document.addEventListener("keyup", event => {
    if (event.keyCode == 16) {
        key1 = false;
    }
      
});

document.addEventListener("click", event => {
    
    if (selectable) {
        for (i = 0; i < card_regions.length; i++) {
            if (mouse.x > card_regions[i].x && mouse.x < card_regions[i].x + card_regions[i].w && mouse.y > card_regions[i].y && mouse.y < card_regions[i].y + card_regions[i].h) {
                //console.log("card: " + me.cards[i].card_val);
                select_card(me.cards[i].card_val, i);
                return;
            }   
        }
    }    
    
    
    if (menuShow) {
        if (buttonClick(buttons.ATV, mouse.x, mouse.y)) {
            menuShow = false;
            activateTV();
        } else if (buttonClick(buttons.SG, mouse.x, mouse.y)) {
            menuShow = false;
            start_game();
        } else if (buttonClick(buttons.NR, mouse.x, mouse.y)) {
            menuShow = false;
            new_round();
        }
    }
    
});

//BUTTON HANDELERS
function drawButton(b) {
    if (b.highlight) {
        ctx.fillStyle = b.highcolor;
    } else {
        ctx.fillStyle = b.color;
    }
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = b.text.color;
    ctx.textAlign = "center"
    ctx.font = "300 " + b.text.size + " roboto"
    ctx.fillText(b.text.string, b.x + (b.w / 2) + b.text.xOff, b.y + (b.h / 2) + b.text.yOff);
}
function drawBorderButton(b) {
    if (b.highlight) {
        ctx.fillStyle = b.highcolor;
        ctx.fillRect(b.x, b.y, b.w, b.h);
    }
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = b.text.color;
    ctx.textAlign = "center"
    ctx.font = "300 " + b.text.size + " roboto"
    ctx.fillText(b.text.string, b.x + (b.w / 2) + b.text.xOff, b.y + (b.h / 2) + b.text.yOff);
}
function buttonHighlight(b, mx, my) {
    if (mx > b.x &&
        mx < b.x + b.w &&
        my > b.y &&
        my < b.y + b.h) {
        b.highlight = true;
    } else {
        b.highlight = false;
    }
}
function buttonClick(b, mx, my) {
    if (b.x < mx &&
        b.x + b.w > mx &&
        b.y < my &&
        b.y + b.h > my) {
        return true
    } else {
        return false;
    }
}
/////////////////


       
document.onmousedown = MouseDown;
document.onmouseup = MouseUp;

function MouseDown(event) {
    
}

function MouseUp(event) {
    
}

update();