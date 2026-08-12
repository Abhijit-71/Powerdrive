import * as THREE from "three";

export default class Environment {
  constructor() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("/assets/blank.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.BoxGeometry(100, 100, 0.1);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    this.floor = new THREE.Mesh(geometry, material);
    //this.floor.castShadow = true;
    this.setupLighting();
    this.floor.receiveShadow = true;
    this.floor.userData.physics = { mass: 0 };
    this.floor.position.y = -0.5;
    this.floor.rotation.x = -Math.PI / 2;
  }

  setupLighting() {
    this.light = new THREE.AmbientLight(0xffffff, 1);
    this.dirLight = new THREE.DirectionalLight(0xffffff, 2);
    //this.dirLight.castShadow = true;
  }
}
