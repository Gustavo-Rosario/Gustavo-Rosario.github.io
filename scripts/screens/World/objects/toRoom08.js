import { alterarTela } from "../../../utils/eventBus.js";
const TILE_SIZE = 75;
export default {
    x: TILE_SIZE * 87.8,
    y: TILE_SIZE * 26.4,
    w: 70,
    h: 200,
    color: "transparent",
    onTouch: function(player) {
        alterarTela('Room08', {playerStart: { x: TILE_SIZE * 1.5, y: TILE_SIZE * 10, direction: "R" }});
        // this.x = -1500; // Move o item para fora da tela
    }
}