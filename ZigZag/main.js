const c = document.getElementById("canvas"), ctx = c.getContext("2d");
var dt, lastTime, game, menu, state;

function main(time = 0) {
    requestAnimationFrame(main);
    dt = time - lastTime;
    lastTime = time;

    switch (state) {
        case 0: 
            menu.draw();
            break;
        case 1:
            game.update();
            break;
    }
}

function setup() {
    c.width = 1920;
    c.height = 1080;
    menu = new Menu();
    game = new Game();
    state = 1;
}

window.onclick = function() {
    if (!game.start) {game.start = true;}
    game.ball.turn();
}

setup();
main();