import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 39.5,
    y: TILE_SIZE * 14,
    w: 70,
    h: 320,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room09', {playerStart: { x: TILE_SIZE* 1.5, y: TILE_SIZE * 14.5, direction: "R"}});
    }
}