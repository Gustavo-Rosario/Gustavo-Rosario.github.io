import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 0,
    y: TILE_SIZE * 8.1,
    w: 70,
    h: 320,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room05', {playerStart: { x: TILE_SIZE* 46, y: TILE_SIZE * 5.5, direction: "L"}});
    }
}