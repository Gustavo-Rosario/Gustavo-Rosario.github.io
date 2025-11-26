import Enemy from '../../Class/Enemy.js';
import map from './map.js';
import objects from './objects/index.js';

const TILE_SIZE = 65;

const Room09Map = {
    map,
    playerStart: { x: TILE_SIZE* 3, y: TILE_SIZE * 12 },
    objects: objects,
    bgPattern: "cavePattern",
    background: "#282828ff",
    enemies: [
        new Enemy({
            name: "Lava 1",
            hp: {max: 100, actual: 100},
            color: "transparent",
            x: TILE_SIZE * 30,
            y: TILE_SIZE * 34,
            w: 1600,
            h: 80,
            attack: 3,
            knockBack: true,
            dmgTimeout: 750
        }),
        new Enemy({
            name: "Lava 2",
            hp: {max: 100, actual: 100},
            color: "transparent",
            x: TILE_SIZE * 55,
            y: TILE_SIZE * 34,
            w: 1100,
            h: 80,
            attack: 3,
            knockBack: true,
            dmgTimeout: 750
        }),
        new Enemy({
            name: "Lava 3",
            hp: {max: 100, actual: 100},
            color: "transparent",
            x: TILE_SIZE * 79,
            y: TILE_SIZE * 34,
            w: 900,
            h: 80,
            attack: 3,
            knockBack: true,
            dmgTimeout: 750
        })
    ],
    envEffect: (player) => {
        // Dano de ambiente muito quente
        // if(player.hasFireSuit) return; // Se tiver a roupa de fogo, não sofre dano
        // else{
        //     const heatDamage = 1; // Dano por frame
        //     if(player.hp.current > 0){
        //         player.takeDmg(heatDamage);
        //         if(player.hp.current < 0) player.hp.current = 0;
        //     }
        // }
    }
}


export default Room09Map;