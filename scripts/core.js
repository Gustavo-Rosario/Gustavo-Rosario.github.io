import { Game } from './Class/Game.js';
import Player from './Class/Player.js';

// =========================== GLOBALS ===========================


const init = async () => {

    // =========================== CANVAS ===========================
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d", {willReadFrequently: true, alpha: true});
    // =========================== PLAYER ===========================
    const player = new Player({
        x: 0,
        y: 0,
        w: 58,
        h: 120,
        vx: 0,
        vy: 0,
        lives: 3,
        hp: {
            max: 300,
            current: 300
        },
        spriteSheet: {
            src: '../../../assets/imgs/player-spritesheet.png',
            srcVaria: '../../../assets/imgs/player-spritesheet-varia.png',
            actions: {
                stand: { row: 0, frames: 8 },
                walk: { row: 1, frames: 6 },
                run: { row: 2, frames: 8 },
                crouch: { row: 3, frames: 4 },
                jump: { row: 4, frames: 1 },
                falling: { row: 3, frames: 5 }
            }
        },
        jumpForce: 10, // Força do pulo
        walkForce: 5, // Força de andar
        isRunning: false, // Modo correr
        isWalking: false, // Modo andar
        direction: "R", // Direção do personagem
        grounded: false,
        // Itens
        haveBall: false,
        haveDoubleJump: false,
        haveSpringBall: false,
        haveSpeedBooster: false,
        haveVaria: false,
        haveUpForce: false,

        keys: {
            green: false,
            blue: false,
            red: false,
            yellow: false
        },

        isBall: false, // Modo bola
        inWall: false,
        frame: 0,             // quadro atual
        frameMax: 8,          // total de quadros
        frameTime: 10,        // tempo por quadro (em frames de jogo)
        frameCounter: 0,       // contador de tempo,

        invencibleFrames: 0,
        invencibleFramesMax: 20,
        isInvencible: false
    });

    const game = new Game({
        player,
        canvas,
        ctx
    });

    await game.startGame();

    // =========================== EVENT BUS ===========================
}

init();