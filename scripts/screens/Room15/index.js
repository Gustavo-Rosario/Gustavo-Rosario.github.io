import Enemy from '../../Class/Enemy.js';
import map from './map.js';
import objects from './objects/index.js';

const TILE_SIZE = 65;

const Room15Map = {
    map,
    playerStart: { x: TILE_SIZE* 1.5, y: TILE_SIZE * 9 },
    objects: objects,
    bgPattern: "mxPattern",
    background: "#141414ff",
    enemies: [],
    envEffect: (player) => {
        // Dano de ambiente muito quente
        if(player.haveVaria) return; // Se tiver a roupa de fogo, não sofre dano
        else{
            const heatDamage = 1; // Dano por frame
            if(player.hp.current > 0){
                player.takeDmg(heatDamage);
                if(player.hp.current < 0) player.hp.current = 0;
            }
        }
    }
}


export default Room15Map;