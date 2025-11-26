import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 35.5,
    y: TILE_SIZE * 114.2,
    w: 30,
    h: 320,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room16', {playerStart: { x: TILE_SIZE* 2, y: TILE_SIZE * 35}});
    }
}