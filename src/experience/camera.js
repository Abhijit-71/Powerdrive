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
        //this.setOrbitControls();
        this.setPointerlControls();
        this.currentPosition = new THREE.Vector3();
        this.currentLookat = new THREE.Vector3();
    }
    
    calcIdealOffset(target){
      const idealOffset = new THREE.Vector3(4,4,0.7);
      idealOffset.applyQuaternion(target.quaternion);
      idealOffset.add(target.position);
      return idealOffset; 
    }

    calcIdealLookat(target){
      const idealLookat = new THREE.Vector3(-1.5,0,0.6);
      idealLookat.applyQuaternion(target.quaternion);
      idealLookat.add(target.position);
      return idealLookat; 
    }

    followUpdate(target){
      if (!target) return;
      const idealOffset = this.calcIdealOffset(target);
      const idealLookat = this.calcIdealLookat(target);

      this.currentPosition.lerp(idealOffset,0.03);
      this.currentLookat.lerp(idealLookat,0.03);

      this.position.copy(this.currentPosition);
      this.lookAt(this.currentLookat);

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
