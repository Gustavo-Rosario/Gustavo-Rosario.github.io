import map from './map.js';
import objects from './objects/index.js';

const Fase01Map = {
    map,
    playerStart: { x: 5280, y: 390 },
    objects: objects,
    background: "#16161d",
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


export default Fase01Map;