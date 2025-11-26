import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 0,
    y: TILE_SIZE * 6,
    w: 70,
    h: 320,
    color: "transparent",
    onTouch: function(player) {
        player.vx = 0;
        player.vy = 0;
        // Volta para mapa do mundo
        alterarTela('Room16', {playerStart: { x: TILE_SIZE* 38, y: TILE_SIZE * 12, direction: "L"}});
    }
}