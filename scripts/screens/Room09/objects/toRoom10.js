import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 74,
    y: TILE_SIZE * 39.6,
    w: 400,
    h: 50,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room10', {playerStart: { x: TILE_SIZE* 11, y: TILE_SIZE * 0, direction: player.direction}});
    }
}