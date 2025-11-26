import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE* 18,
    y: TILE_SIZE * 39.5,
    w: 420,
    h: 40,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room14', {playerStart: { x: TILE_SIZE* 13, y: TILE_SIZE * 1.5, direction: player.direction}});
    }
}