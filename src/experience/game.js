import { Renderer } from './renderer'
import { Camera } from './camera';
import { Scene } from './scene';
import Sizes from './utils/Sizes'
import Time from './utils/Time'
import { Car } from './car/car';
import { RapierPhysics } from 'three/addons/physics/RapierPhysics.js';
import { RapierHelper } from 'three/addons/helpers/RapierHelper.js';
import Environment from './environment/environment';

let instance = null;

export default class Game {
    
    constructor(canvas,resources,physics){
        
        //singleton class
        if(instance){
            return instance;
        }
        if(!instance && canvas == null){
            console.log("error")
        }
        instance = this;


        this.physics = physics

        const physicsHelper = new RapierHelper( this.physics.world );
		

        this.canvas = canvas;
        this.resources = resources;
        this.car_model = this.resources.items.car;
        this.car = new Car(this.car_model,physics);
        this.sizes = new Sizes();
        this.time = new Time();
        this.camera = new Camera(this);
        this.env = new Environment();
        this.scene = new Scene(this,this.env);
        this.renderer = new Renderer(this.scene,this.camera,canvas);
        

        //this.scene.add(this.car);
        
        this.scene.add( physicsHelper );
        this.physics.addScene(this.env.floor)

        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
        
    }
    
    resize(){
        this.camera.resize(this.sizes.width,this.sizes.height);
        this.renderer.resize(this.sizes.width,this.sizes.height);

    }
    update(){
        this.car.updateCarControl();
        this.car.vehicleController.updateVehicle( 1 / 60 );
		this.car.updateWheels();
        this.renderer.render(this.scene,this.camera)
        this.camera.controls.update()
    }
    
    }
