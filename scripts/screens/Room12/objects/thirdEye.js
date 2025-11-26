import { mostrarDialogo } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;
export default{
    x: TILE_SIZE * 25.45,
    y: TILE_SIZE * 10.45,
    w: 18 * 4,
    h: 18 * 4,
    color: "red",
    // condition: (player) => !player.keys.yellow,
    sprite: {
        width: 18 * 3,
        height: 18 * 3,
        src: "/assets/imgs/items.png", // Caminho para a imagem do sprite
        cutW: 0,
        cutH: (18 * 3) * 0,
        frame: 0, // Quadro atual do sprite
        frameMax: 10, // Total de quadros do sprite
        frameTime: 5, // Tempo por quadro (em frames de jogo)
        frameCounter: 0 // Contador de tempo para animação
    },
    onTouch: function(player) {
      player.getItem = true;

      player.hasGravity = true;

      const bgm = document.getElementById("foundItem");
      bgm.play();
      
      setTimeout(() => {

        const bgm = document.getElementById("bjXau");
          bgm.volume = 1; // Ajusta o volume
          bgm.play();
          player.getItem = false;
          player.haveThirdEye = true;

          mostrarDialogo({ color: 'yellow', text: "O TERCEIRO OLHO"}, "As chaves ocultas agora se tornam visiveis para seu olhar afiado");

          bgm.volume = 0.5; // Ajusta o volume
          this.x = -1500; // Move o item para fora da tela
      }, 2000);

    }
  }