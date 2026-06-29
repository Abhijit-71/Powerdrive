import * as THREE from 'three'; 
import Experience from './experience';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';


export class Camera extends THREE.PerspectiveCamera {
    static BASE_FOV = 75; 
    constructor(experience){
        super(
            Camera.BASE_FOV,
            window.innerWidth/window.innerHeight,
            0.1,
            10000
        )
        this.position.y = 3 ;
        this.position.z = 4;
        //this.rotation.x = 30;
        this.position.x=3;
        this.experience = experience;
        this.setPointerlControls();
        //this.setOrbitalControls();
    }
    

    setPointerlControls(){
        this.controls = new PointerLockControls(this,this.experience.canvas);

    window.addEventListener("click", () => {
        this.controls.lock();
    });
    }

    
}