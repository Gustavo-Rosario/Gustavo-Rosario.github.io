import map from './map.js';
import objects from './objects/index.js';

const TILE_SIZE = 65;

const FinalRoomMap = {
    map,
    playerStart: { x: TILE_SIZE* 1.5, y: TILE_SIZE * 13 },
    objects: [
        {
            x: TILE_SIZE * 26,
            y: TILE_SIZE * 13,
            w: 70,
            h: 200,
            color: "pink",
            onTouch: function(player) {
                finalBoss.START = true;
                // Volta para mapa do mundo
                mostrarDialogo({color: "#e2be1eff", text: "Eggman/Dr Robotnik ???"}, "Parece que o bigodudo confundiu os chakras com as esmeraldas do caos. Mande ele pra bem longe!!!" );
                this.x =-200;

                const bossTheme = document.getElementById("bossTheme");
                bossTheme.volume = 0.2;
                bossTheme.play();

                // document.body.style.transform = "scale(0.8)";
                // document.body.style.transformOrigin = "0 0";

                
            //     const canvas = document.getElementById("game");
            //     // const ctx = canvas.getContext("2d", {willReadFrequently: true, alpha: true});
                
            //     canvas.width = window.innerWidth;
            //     canvas.height = window.innerHeight;
            //     document.body.style.zoom = "80%";
            }
        }
    ],
    background: "#1151ffff",
    enemies: [
        finalBoss
    ],
}


export default FinalRoomMap;