import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 59,
    y: TILE_SIZE * 4,
    w: 70,
    h: 200,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room13', {playerStart: { x: TILE_SIZE* 1.5, y: TILE_SIZE * 14, direction: player.direction}});
    }
}