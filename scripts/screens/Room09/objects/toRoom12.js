import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 137,
    y: TILE_SIZE * 38,
    w: 70,
    h: 100,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room12', {playerStart: { x: TILE_SIZE* 28, y: TILE_SIZE * 0, direction: player.direction}});
    }
}