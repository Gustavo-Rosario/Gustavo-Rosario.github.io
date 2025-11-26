import Enemy from '../../Class/Enemy.js';
import Object from '../../Class/Object.js';
import { Screen } from '../../Class/Screen.js';
import drawParallax from '../../utils/drawParallax.js';
import map from './map.js';

import objects from './objects/index.js';

const TILE_SIZE = 75;

const planet = new Image();
planet.src = '../../../assets/imgs/planet.png';

const WorldScreen = {
    map,
    playerStart:{ x: TILE_SIZE * 34, y: TILE_SIZE * 23.5 },
    objects: objects,
    layers: [
        {
            img: planet,
            speed: 3,
            position: {x: 0, y: 0},
            sizeFinal: {w: 1600, h: 900},
            cutSize: {w: 80, h: 45},
            offsets: 0
        }
    ],
    background: "#88c5d2ff"


    // drawBg: ({canvas, ctx, cameraOffset}) => {
        // console.log(cameraOffset);

        // const focusWorld = { x: 2550, y: 1400 }; // posição fixa no mundo
        // const radius = 400;

        // // converte coordenadas do mundo para a tela
        // const cx = focusWorld.x - cameraOffset.offsetX;
        // const cy = focusWorld.y - cameraOffset.offsetY;

        // // 1️⃣ Preenche tudo com a máscara escura
        // ctx.fillStyle = "rgba(0,0,0,0.7)";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

        // // 2️⃣ Define recorte circular
        // ctx.save();
        // ctx.beginPath();
        // ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        // // ctx.fillStyle = "red";
        // // ctx.fill();
        // ctx.closePath();
        // ctx.clip();

        // // 3️⃣ Redesenha o parallax dentro do buraco (cores 100% originais)
        // drawParallax(WorldScreen.layers, ctx, canvas, {
        //     position: {x: cx, y: cy - 300}
        // });
        // ctx.restore();
    // } 
};


export default WorldScreen;