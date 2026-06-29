import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Environment from "./environment/environment";

export class Scene extends THREE.Scene {
  //public cube;
  constructor() {
    super();
    this.env = new Environment();

    const gltfLoader = new GLTFLoader();
    const url =
      "/src/assets/monster.gltf";
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      root.position.set(0, 0, 0);
      this.add(root);
    });
    
    //floor.rotation.set(0,90,0);
    

    this.add(this.env.floor);
    this.add(this.env.light);
    this.add(this.env.dirLight);
  }
}
