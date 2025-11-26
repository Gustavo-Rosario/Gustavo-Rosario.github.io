import { mostrarDialogo } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;
export default{
    x: TILE_SIZE * 53.45,
    y: TILE_SIZE * 20.45,
    w: 18 * 4,
    h: 18 * 4,
    color: "red",
    condition: (player) => !player.haveSpringBall,
    sprite: {
        width: 18 * 3,
        height: 18 * 3,
        src: "/assets/imgs/items.png", // Caminho para a imagem do sprite
        cutW: 0,
        cutH: (18 * 3) * 5,
        frame: 0, // Quadro atual do sprite
        frameMax: 10, // Total de quadros do sprite
        frameTime: 5, // Tempo por quadro (em frames de jogo)
        frameCounter: 0 // Contador de tempo para animação
    },
    onTouch: function(player) {
      player.getItem = true;

      player.haveSpringBall = true;

      const bgm = document.getElementById("foundItem");
      bgm.play();
      
      setTimeout(() => {
        const bgm = document.getElementById("bjXau");
          bgm.volume = 1; // Ajusta o volume
          bgm.play();

          player.getItem = false;
          bgm.volume = 0.5; // Ajusta o volume
          this.x = -1500; // Move o item para fora da tela

          mostrarDialogo({ color: 'yellow', text: "Pulo agachado"}, "Agora é possível pular mesmo estando agachada (Não precisa de lógica)");
      }, 2000);

    }
  }