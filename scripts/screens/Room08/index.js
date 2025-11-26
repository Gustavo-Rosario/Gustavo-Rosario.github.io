import map from './map.js';
import objects from './objects/index.js';

const TILE_SIZE = 65;

const Room08Map = {
    map,
    playerStart: { x: TILE_SIZE  * 2, y: TILE_SIZE * 12 },
    objects: objects,
    background: "#bebef1ff",
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


export default Room08Map;