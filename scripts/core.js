import { Game } from "./Class/Game.js";
import { Sprite } from "./Class/Sprite.js";
import { getCanvasContext } from "./utils/getCanvasContext.js";
import { baseInfo } from "./utils/baseInfo.js";
import { Controller } from "./Class/Controller.js";
import { Character } from "./Class/Character.js";
import { Platform } from "./Class/Platform.js";


(function(){
    // const { canvas, context} = getCanvasContext();
    
    // function resizeCanvas() {
    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerHeight;
    // }
    
    // window.addEventListener('resize', resizeCanvas);
    // resizeCanvas();

    // const hero = new Character(100, 150, 70, 70, 'blue', true);

    // const ground = new Platform(0, canvas.height - 50, canvas.width, 50, 'green', true);
    // const leftWall = new Platform(0, 0, 50, canvas.height, 'green', true);
    // const rightWall = new Platform(canvas.width - 50, 0, 50, canvas.height, 'green', true);
    // const step = new Platform(canvas.width - 350, canvas.height -150, 150, 110, 'green', true);
    // const step2 = new Platform(250, canvas.height -250, 250, 10, 'green', true);

    // const game = new Game([
    //     new Sprite(50, 50, 100, 100, 'red'),
    //     hero,
    //     ground,
    //     leftWall,
    //     rightWall,
    //     step,
    //     step2
    // ]);

    // setInterval(() => {
    //     game.gameLoop();
    // }, 1000 / baseInfo.FRAMES_PER_SECOND); // 60 FPS


    // // Adiciona controle
    // const controle = new Controller(hero);
    // controle.start();
    

    // CRIAÇÃO DE MAPA POR TILEMAP
    const { canvas, context } = getCanvasContext();

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const { TILEMAP, TILE_SIZE } = baseInfo;

    const sprites = [];

    // Cria os tiles do mapa
    TILEMAP.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile === 1) { // Se o tile for 1, cria uma plataforma
                const x = colIndex * TILE_SIZE;
                const y = rowIndex * TILE_SIZE;
                const platform = new Platform(x, y, TILE_SIZE, TILE_SIZE, 'green', true);
                sprites.push(platform);
            }
        });
    });

    const hero = new Character(100, 150, 40, 40, 'blue', true);

    sprites.push(hero);

    const game = new Game(sprites);

    // Adiciona controle
    const controle = new Controller(hero);
    controle.start();
    
    // requestAnimationFrame(() => {
        game.gameLoop();
    // }; // 60 FPS

})();