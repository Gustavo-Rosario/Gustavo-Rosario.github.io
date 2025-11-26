const TILE_SIZE = 65;
export default{
    x: TILE_SIZE * 53.45,
    y: TILE_SIZE * 16.5,
    w: 18 * 4,
    h: 18 * 4,
    color: "red",
    condition: (player) => !player.keys.green && player.haveThirdEye,
    sprite: {
      src: "../assets/imgs/general.png", // Caminho para a imagem do sprite
      cutH: (32 * 5) * 0,
      cutW: (32 * 5) * 6,
      frame: 0, // Quadro atual do sprite
      frameMax: 1, // Total de quadros do sprite
      frameTime: 5, // Tempo por quadro (em frames de jogo)
      frameCounter: 0 // Contador de tempo para animação
    },
    onTouch: function(player) {
      player.getItem = true;

      const bgm = document.getElementById("foundItem");
      bgm.volume = 0.5; // Ajusta o volume
      bgm.play();

      setTimeout(() => {
          player.getItem = false;
          player.keys.green = true; // Libera corrida
          this.x = -1500; // Move o item para fora da tela
      }, 2000);

    }
  }