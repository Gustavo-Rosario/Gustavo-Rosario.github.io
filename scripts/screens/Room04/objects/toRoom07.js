import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 0,
    y: TILE_SIZE * 103,
    w: 30,
    h: 320,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room07', {playerStart: { x: TILE_SIZE* 98, y: TILE_SIZE * 54.5}});
    }
}