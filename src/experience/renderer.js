import * as THREE from 'three';
import {Scene} from './scene'
import {Camera} from './camera'

export class Renderer extends THREE.WebGLRenderer{
    
    constructor(scene,camera){
        super({antialias : true});
        this.scene = scene;
        this.camera = camera;
        this.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.domElement);
        //this.domElement.onclick = this.pointerlock.bind(this);
        
    }
    
}