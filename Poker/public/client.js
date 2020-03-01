var socket;
socket = io.connect("192.168.1.157:8000");

socket.on("connect", function(data) {
    
});

socket.on("update-players", function(l2) {
    me = l2[search_for_player_in_list(socket.id, l2)];
    l2.splice(search_for_player_in_list(socket.id, l2), 1);
    players = l2;
    
});


socket.on("player-created", function(id) {
    if (id == socket.id) {
        state = "lobby";
    }
});

socket.on("refresh-client", function() {
    location.reload();
});


//window.setInterval(function() {
//    
//}, 10);

function search_for_player_in_list(pl, list) {
    var ind;
    for (i = 0; i < list.length; i++) {
        if (list[i].id == pl) {
            ind = i;
            return ind;
        }
    }
}

function refresh() {
    socket.emit("refresh");
}

function updateList() {
    socket.emit("update-list");
}