import { mostrarDialogo } from "../../../utils/eventBus.js";

const TILE_SIZE = 65;
export default{
    x: TILE_SIZE * 1.45,
    y: TILE_SIZE * 5.45,
    w: 18 * 4,
    h: 18 * 4,
    color: "red",
    condition: (player) => !player.haveSpeedBooster,
    sprite: {
        width: 18 * 3,
        height: 18 * 3,
        src: "/assets/imgs/items.png", // Caminho para a imagem do sprite
        cutW: 0,
        cutH: (18 * 3) * 2,
        frame: 0, // Quadro atual do sprite
        frameMax: 10, // Total de quadros do sprite
        frameTime: 5, // Tempo por quadro (em frames de jogo)
        frameCounter: 0 // Contador de tempo para animação
    },
    onTouch: function(player) {
      player.getItem = true;

      player.haveSpeedBooster = true;

      const bgm = document.getElementById("foundItem");
      bgm.play();
      
      setTimeout(() => {

        const bgm = document.getElementById("rapidao");
          bgm.volume = 1; // Ajusta o volume
          bgm.play();

          player.getItem = false;
          bgm.volume = 0.5; // Ajusta o volume

          mostrarDialogo({ color: 'yellow', text: "Hora do Sonic!"}, "Seu verdadeiro potencial foi desbloqueado. Use o botão (Y) para correr");

          this.x = -1500; // Move o item para fora da tela
      }, 2000);


    }
  }