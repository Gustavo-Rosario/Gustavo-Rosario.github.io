import Boss from '../../Class/Boss.js';
import { mostrarDialogo, alterarState } from '../../utils/eventBus.js';
import map from './map.js';
import objects from './objects/index.js';

const TILE_SIZE = 65;

const finalBoss = new Boss({
    name: "Eggman",
    hp: {
        current: 100,
        max: 100
    },
    x: TILE_SIZE * 10,
    y: TILE_SIZE * 10,
    w: 150,
    h: 150,
    color: "green",
    attack: 20,
    onDefeated: () => {

        const bossTheme = document.getElementById("bossTheme");
        bossTheme.pause();
        mostrarDialogo({ color: '#f3b736ff', text: "PARABEEEEEEENS"}, "Você protegeu os sete chakras derrotando o confuso Eggman. Depois de uma longa saga para alcançar todos os limites desse jogo, seria este o fim da jornada? Até uma próxima aventura !!!", null, () => alterarState('CREDITS'))

    }
});

const FinalRoomMap = {
    map,
    playerStart: { x: TILE_SIZE* 1.5, y: TILE_SIZE * 13 },
    objects: [
        {
            x: TILE_SIZE * 26,
            y: TILE_SIZE * 13,
            w: 70,
            h: 200,
            color: "transparent",
            onTouch: function(player) {
                finalBoss.START = true;
                // Volta para mapa do mundo
                mostrarDialogo({color: "#e2be1eff", text: "Eggman ???"}, "Parece que o bigodudo confundiu os chakras com as esmeraldas do caos. Mande ele pra bem longe!!!" );
                this.x =-200;

                const bossTheme = document.getElementById("bossTheme");
                bossTheme.volume = 0.2;
                bossTheme.play();

                const bgm = document.getElementById("bgm");
                bgm.volume = 0;
                bgm.pause();
            
            }
        }
    ],
    background: "#1151ffff",
    enemies: [
        finalBoss
    ],
}

export default FinalRoomMap;