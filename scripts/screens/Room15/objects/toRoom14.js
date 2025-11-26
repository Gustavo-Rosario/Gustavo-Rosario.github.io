import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE* 69.5,
    y: TILE_SIZE * 4,
    w: 40,
    h: 420,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room14', {playerStart: { x: TILE_SIZE* 2, y: TILE_SIZE * 10, direction: player.direction}});
    }
}