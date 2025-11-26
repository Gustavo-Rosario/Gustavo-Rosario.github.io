import { alterarTela } from "../../../utils/eventBus.js";

const TILE_SIZE = 75;

export default {
    x: 65 * 5.7,
    y: 65 * 24.5,
    w: 300,
    h: 70,
    color: "transparent",
    onTouch: function(player) {
        // Volta para mapa do mundo
        alterarTela('Fase01', {playerStart: { x: TILE_SIZE * 12, y: TILE_SIZE * 0.3, direction: player.direction }});
    }
}