import * as THREE from 'three'; 
import Game from './game';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


export class Camera extends THREE.PerspectiveCamera {
    static BASE_FOV = 75; 
    constructor(game){
        super(
            Camera.BASE_FOV,
            window.innerWidth/window.innerHeight,
            0.1,
            10000
        )
        
        
        this.game = game;
        this.setOrbitControls();
        //this.setPointerlControls();
        
    }
    

    setPointerlControls(){
        this.controls = new PointerLockControls(this,this.game.canvas);
        this.position.y = 3;
        this.position.z = 0;
        this.rotation.y = -Math.PI/2;
        this.position.x=-1.5;

        window.addEventListener("click", () => {
        this.controls.lock();});
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this,this.game.canvas);
        this.position.set( 0, 5, 10 );
    
    }
    
    resize(w,h){
        this.aspect = w/h;
        this.updateProjectionMatrix();
    }
    
}