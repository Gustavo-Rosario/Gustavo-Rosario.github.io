import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 57,
    y: TILE_SIZE * 19,
    w: 150,
    h: 70,
    color: "transpaent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Room17', {playerStart: { x: TILE_SIZE* 8, y: TILE_SIZE * 2, direction: player.direction}});
    }
}