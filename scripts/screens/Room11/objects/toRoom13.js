import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE* 2,
    y: TILE_SIZE * 0,
    w: 420,
    h: 40,
    color: "transparent",
    onTouch: function(player) {
        player.vy = -20;
        // Volta para mapa do mundo
        alterarTela('Room13', {playerStart: { x: TILE_SIZE* 26, y: TILE_SIZE * 17, direction: player.direction}});
    }
}