import * as THREE from '../../libs/three/three.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';
import { GLTFLoader } from '../../libs/three/jsm/GLTFLoader.js';
import { Stats } from '../../libs/stats.module.js';
import { CanvasUI } from '../../libs/CanvasUI.js'
import { ARButton } from '../../libs/ARButton.js';
//import { FBXLoader } from '../../libs/three/jsm/FBXLoader.js';
import { LoadingBar } from '../../libs/LoadingBar.js';
//import { Player } from '../../libs/Player.js';
import { ControllerGestures } from '../../libs/ControllerGestures.js';

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
		
		this.scene = new THREE.Scene();
        this.scene.add(this.camera);
       
		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 3.5, 0);
        this.controls.update();
        
        this.stats = new Stats();
        
        this.initScene();
        this.setupVR();
        console.log(this.ui.content.info);
        console.log('before settimeou');
        console.log(this.ui.content.info);
        console.log('after settimeou');
        window.addEventListener('resize', this.resize.bind(this) );
	}	
    
    initScene(){
        this.loadingBar = new LoadingBar();
        
        this.assetsPath = '../../assets/';
        const loader = new GLTFLoader().setPath(this.assetsPath);
		const self = this;

        loader.load(
			// resource URL
			'chair.glb',
			// called when the resource is loaded
			function ( gltf ) {

                self.apple = gltf.scene;
                //self.scene.add( self.apple ); 
                self.loadingBar.visible = false;
                self.apple.visible=false;
				const scale = 0.03;
				self.apple.scale.set(scale, scale, scale); 
                
				//self.apple.position.set(0,5,-2);
                //self.apple.rotateX(Math.PI / 2);
                //self.scene.add(self.apple);
			},
			// called while loading is progressing
			function ( xhr ) {

				self.loadingBar.progress = (xhr.loaded / xhr.total);
			},
			// called when loading has errors
			function ( error ) {
				console.log( 'An error happened lol' );
			}
        );

        this.createUI();
        this.createUI2();

    }

    createUI() {
        
        const config = {
            panelSize: { width: 0.15, height: 0.038 },
            height: 128,
            backgroundColour: '#FFF5EE',
            info:{ type: "text" }
        }
        const content = {
            info: "Price: 1.53e/kg"
        }        
        const ui = new CanvasUI( content, config );
        
        this.ui = ui;
    }

    createUI2() {
        
        const config = {
            panelSize: { width: 0.15, height: 0.038 },
            height: 128,
            backgroundColour: '#FFF5EE',
            info:{ type: "text" }
        }
        const content = {
            info: "Sold per kilogram: 60"
        }
        
        const ui = new CanvasUI( content, config );
        
        this.ui2 = ui;
    }
    
    setupVR(){
        this.renderer.xr.enabled = true; 
        
        const self = this;
        //let controller;

        /*function onSessionStart(){
            self.ui.mesh.position.set( 0, -0.15, -0.3 );
            self.camera.add( self.ui.mesh );
        }*/
        
       /* function onSessionEnd(){
            self.camera.remove( self.ui.mesh );
        }*/
        

        const btn = new ARButton( this.renderer);
        
        //controller = this.renderer.xr.getController( 0 );
        //controller.addEventListener( 'select', onSelect );
        //this.scene.add( controller );

        this.gestures = new ControllerGestures( this.renderer );

        this.gestures.addEventListener( 'tap', (ev)=>{
            console.log( 'tap' ); 
            if (!self.apple.visible){
                self.apple.visible = true;
                self.apple.position.set( 0, -0.3, -0.7 ).add( ev.position );
                self.ui.mesh.position.set(0.1, 0.01, -0.2).add(ev.position);
                self.ui2.mesh.position.set(-0.1, 0.01, -0.2).add(ev.position);
                self.scene.add( self.apple); 
                self.scene.add(self.ui.mesh);
                self.scene.add(self.ui2.mesh);
                setTimeout( this.plotting(),300000);
            }
        });

        this.renderer.setAnimationLoop( this.render.bind(this) );
        console.log('setupa vr');
    }
    
    plotting(){
        this.ui.updateElement('info', 'Price: 2.3e/kg');
        this.ui2.updateElement('info', 'Sold per kilogram: 40');
    }
   
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    

    render( ) {   
        const dt = this.clock.getDelta();
        this.stats.update();
        if ( this.renderer.xr.isPresenting ){
            this.gestures.update();
            this.ui.update();
            this.ui2.update();
        }
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };