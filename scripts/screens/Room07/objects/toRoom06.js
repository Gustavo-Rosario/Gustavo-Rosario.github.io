import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE* 0,
    y: TILE_SIZE * 8,
    w: 70,
    h: 420,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room06', {playerStart: { x: TILE_SIZE* 57, y: TILE_SIZE * 30, direction: "L"}});
    }
}