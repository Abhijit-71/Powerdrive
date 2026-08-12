import './style.css'
import Game from "./experience/game"
import Resources from './experience/utils/Resources'
import { RapierPhysics } from 'three/examples/jsm/Addons.js'

const src = [
            {
                name: "car",
                type: "gltfModel",
                path: "/public/assets/sizuka.glb"
            },

        ]
        


const physics = await RapierPhysics();

const res = new Resources(src);

res.on("ready", () => {

    const game = new Game(document.getElementById("game"),res,physics);

});




