import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE* 0,
    y: TILE_SIZE * 6,
    w: 30,
    h: 420,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        player.vx = 0;
        player.vy = 0;
        alterarTela('Room11', {playerStart: { x: TILE_SIZE* 27, y: TILE_SIZE * 8, direction: "L"}});
    }
}