import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 59,
    y: TILE_SIZE * 1,
    w: 70,
    h: 520,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Fase01', {playerStart: { x: TILE_SIZE* 2, y: TILE_SIZE * 11}});
    }
}