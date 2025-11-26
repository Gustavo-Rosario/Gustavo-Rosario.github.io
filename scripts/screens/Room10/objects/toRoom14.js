import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE*0,
    y: TILE_SIZE * 61,
    w: 40,
    h: 420,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        player.vx = 0;
        player.vy = 0;
        alterarTela('Room14', {playerStart: { x: TILE_SIZE* 33, y: TILE_SIZE * 10, direction: "L"}});
    }
}