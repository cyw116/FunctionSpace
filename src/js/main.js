import TheGame from "./game.js";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 480;
// const MAX_RATIO = 1.25;
// const MIN_RATIO = 1.25;//0.6;

let theCanvas = document.getElementById("main_game");

// Loading
let game = new TheGame(theCanvas);

game.setCanvasConfig({
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
});

game.startGameLoop();
