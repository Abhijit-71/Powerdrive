import { Renderer } from './renderer'
import { Camera } from './camera';
import { Scene } from './scene';
import Sizes from './utils/Sizes'
import Time from './utils/Time'

let instance = null;

export default class Experience {
    
    //public phyEngine!:HTMLCanvasElement;
    

    
    constructor(canvas){
        if(instance){
            return instance;
        }
        if(!instance && canvas == null){
            console.log("error")
        }
        instance = this;
        
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.camera = new Camera(this);
        this.scene = new Scene();
        this.renderer = new Renderer(this.scene,this.camera);
        

        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
        
    }
    
    resize(){

    }
    update(){
        this.renderer.render(this.scene,this.camera)
    }
}