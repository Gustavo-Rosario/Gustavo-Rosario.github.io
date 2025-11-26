import { mostrarDialogo } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;
export default{
    x: TILE_SIZE * 74.3,
    y: TILE_SIZE * 27,
    w: 90,
    h: 90,
    color: "red",
    sprite: {
      width: 18 * 3,
        height: 18 * 3,
        src: "/assets/imgs/items.png", // Caminho para a imagem do sprite
        cutW: 0,
        cutH: (18 * 3) * 1,
        frame: 0, // Quadro atual do sprite
        frameMax: 10, // Total de quadros do sprite
        frameTime: 5, // Tempo por quadro (em frames de jogo)
        frameCounter: 0 // Contador de tempo para animação
    },
    onTouch: function(player) {
      player.getItem = true;

      const bgm = document.getElementById("foundItem");
      bgm.volume = 0.5; // Ajusta o volume
      bgm.play();

      setTimeout(() => {
          const bgm = document.getElementById("bjXau");
          bgm.volume = 1; // Ajusta o volume
          bgm.play();

          player.getItem = false;
          player.haveDoubleJump = true; // Libera corrida
          mostrarDialogo ({ color: 'yellow', text: "Super pulo"}, "Pule muito mais alto");
          this.x = -1500; // Move o item para fora da tela
      }, 2000);

    }
  }