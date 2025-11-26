import map from './map.js';
import objects from './objects/index.js';

const TILE_SIZE = 60;

const Room02Map = {
    map,
    playerStart: { x: TILE_SIZE * 5, y: TILE_SIZE * 5 },
    objects: objects,
    background: "#568effff"
}


export default Room02Map;