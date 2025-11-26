import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE* 8,
    y: TILE_SIZE * 0,
    w: 100,
    h: 40,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room08', {playerStart: { x: TILE_SIZE* 58, y: TILE_SIZE * 14, direction: "L"}});
    }
}