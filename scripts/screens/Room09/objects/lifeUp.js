const TILE_SIZE = 65;
export default {
    x: TILE_SIZE * 10,
    y: TILE_SIZE * 26,
    w: 90,
    h: 90,
    color: "red",
    sprite: {
      src: "../assets/imgs/general.png", // Caminho para a imagem do sprite
      cutH: (32 * 5) * 1,
      frame: 0, // Quadro atual do sprite
      frameMax: 10, // Total de quadros do sprite
      frameTime: 5, // Tempo por quadro (em frames de jogo)
      frameCounter: 0 // Contador de tempo para animação
    },
    onTouch: function(player) {
        // player.saveGame();
        player.isMeditating = true;
        if(player.hp.current < player.hp.max) player.hp.current += 1; // Aumenta 1 vida
    //   player.jumpForce += player.jumpForce; // Aumenta a força do pulo
    //   mostrarDialogo({ color: 'yellow', text: "Pulo VANS"}, "Você não pulou um legday. Então agora PULE mais alto com o Vans! Basta segurar o botão de pulo ( B )");


        const bgm = document.getElementById("meditation");
        bgm.volume = 0.5; // Ajusta o volume
        bgm.play();
    },
    onTouchLeave: function(player) {
        player.isMeditating = false;
        const bgm = document.getElementById("meditation");
        bgm.pause();
        bgm.currentTime = 0;
    }
  }