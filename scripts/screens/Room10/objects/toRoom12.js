import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 29,
    y: TILE_SIZE * 26,
    w: 70,
    h: 320,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room12', {playerStart: { x: TILE_SIZE* 1.5, y: TILE_SIZE * 12.3, direction: "R"}});
    }
}