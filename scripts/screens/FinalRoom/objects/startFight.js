import { mostrarDialogo } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 26,
    y: TILE_SIZE * 13,
    w: 70,
    h: 200,
    color: "pink",
    onTouch: function(player) {        

        // Volta para mapa do mundo
        mostrarDialogo({color: "red", text: "Hora do Chefão"}, "Elimine o grande chefe e mostre que vc é a verdadeira dominadora dos chakras" );
        this.x =-200;

        const bgm = document.getElementById("bgm");
        bgm.volume = 0;
        bgm.pause();

        const bossTheme = document.getElementById("bossTheme");
        bossTheme.volume = 1;
    }
}