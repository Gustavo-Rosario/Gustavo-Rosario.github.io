import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE* 24,
    y: TILE_SIZE * 19.5,
    w: 420,
    h: 40,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room11', {playerStart: { x: TILE_SIZE* 5, y: TILE_SIZE * 2, direction: player.direction}});
    }
}