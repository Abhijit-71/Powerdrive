import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Environment from "./environment/environment";
import { Car } from "./car/car";

export class Scene extends THREE.Scene {
  //public cube;
  constructor(game,env) {
    super();
    this.env = env;
    this.exp = game;
    
    
    //floor.rotation.set(0,90,0);
    
    this.background = new THREE.Color( 0xbfd1e5 );
    
    this.add(this.exp.car_model)
    console.log("hell const")
    //this.car = this.load()

    //this.add(this.model)
    
    this.add(this.env.floor);
    this.add(this.env.light);
    this.add(this.env.dirLight);
  }
}
