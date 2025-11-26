import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE* 39,
    y: TILE_SIZE * 7,
    w: 70,
    h: 420,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room15', {playerStart: { x: TILE_SIZE* 2, y: TILE_SIZE * 8, direction: player.direction}});
    }
}