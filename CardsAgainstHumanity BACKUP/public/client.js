var socket;
socket = io.connect("192.168.56.1:3000"); // localhost
//socket = io.connect("172.17.5.83:3000"); // default gateway

socket.on("connect", function(data) {
    
});

//var sound = new Audio('sound.mp3');


socket.on("update_player", function(list) {
    for (i = 0; i < list.length; i++) {
        if (list[i].id == socket.id) {
            me.id = list[i].id;
            me.name = list[i].name;
            me.cards = list[i].cards;
            me.score = list[i].score;
            list.splice(i, 1);
            break;
        }
    }
    
    players = list;
});


socket.on("question", function(q) {
    currentQ = q;
});


socket.on("set_tv", function(i) {
    if (socket.id == i) {
        tv_Mode = true;
    }
});

socket.on("show_answers", function(a) {
    if (tv_Mode) {
        display_answers = a;
        show_the_answers = true;
        
        //document.getElementById("s").play();
        window.setTimeout(function() {
            show.f = true
        }, 1000);
    }
});

socket.on("selectableON", function() {
    selectable = true;
});

socket.on("selectableOFF", function() {
    selectable = false;
});

socket.on("remove_answer", function() {
    me.cards.splice(choice, 1);
    choice = null;
    socket.emit("answer_removed", me.cards, socket.id);
});



function select_card(val, ind) {
    socket.emit("selected_card", socket.id, val);
    selectable = false;
    choice = ind;
}

function llog() {
    socket.emit("log_list");
}

function activateTV() {
    socket.emit("tvMode",socket.id);
}

function start_game() {
    socket.emit("start_game");
}

function new_round() {
    socket.emit("new_round");
    show_the_answers = false;
    show.f = false;
    show.s = false;
    show.t = false;
    show.final = false,
    show.counter = 0;
    show.opacity = 0;
    show.fadeIN = true;
    
    display_answers = [];
    currentQ = "";
}