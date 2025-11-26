import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 99,
    y: TILE_SIZE * 52,
    w: 70,
    h: 320,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room04', {playerStart: { x: TILE_SIZE* 1.7, y: TILE_SIZE * 105.5, direction: "R"}});
    }
}