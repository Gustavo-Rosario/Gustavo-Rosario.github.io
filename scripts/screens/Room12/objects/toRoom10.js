import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE* 0,
    y: TILE_SIZE * 10,
    w: 40,
    h: 420,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room10', {playerStart: { x: TILE_SIZE * 28, y: TILE_SIZE * 29.5, direction: "L"}});
    }
}