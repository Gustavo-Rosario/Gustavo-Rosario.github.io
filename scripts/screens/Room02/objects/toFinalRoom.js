import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;

export default {
    x: TILE_SIZE * 0,
    y: TILE_SIZE * 0,
    w: 30,
    h: 300,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('FinalRoom', {playerStart: { x: TILE_SIZE * 29, y: TILE_SIZE * 15, direction: player.direction }});
    }
}