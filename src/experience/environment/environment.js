import * as THREE from 'three';

export default class Environment{


    constructor(){
        const loader = new THREE.TextureLoader();
        const texture = loader.load( '/src/assets/blank.png' );
        texture.colorSpace = THREE.SRGBColorSpace;
        const geometry = new THREE.PlaneGeometry(100,100);
        const material = new THREE.MeshPhongMaterial({map:texture});
        this.floor = new THREE.Mesh(geometry,material)
        this.floor.rotation.x = -Math.PI / 2;
        this.setupLighting()
       
    }

    setupLighting(){
        this.light = new THREE.AmbientLight(0xffffff, 1);
        this.dirLight = new THREE.DirectionalLight(0xffffff, 2)
    }
}