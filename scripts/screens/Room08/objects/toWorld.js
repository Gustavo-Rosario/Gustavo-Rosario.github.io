import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 0,
    y: TILE_SIZE * 9,
    w: 50,
    h: 290,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('World', {playerStart: { x: TILE_SIZE* 100, y: TILE_SIZE * 33, direction: player.direction}});
    }
}