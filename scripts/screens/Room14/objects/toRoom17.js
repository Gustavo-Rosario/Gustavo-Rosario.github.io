import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 13,
    y: TILE_SIZE * 0,
    w: 70,
    h: 40,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        player.vy = - 20;
        alterarTela('Room17', {playerStart: { x: TILE_SIZE* 18, y: TILE_SIZE * 36, direction: player.direction}});
    }
}