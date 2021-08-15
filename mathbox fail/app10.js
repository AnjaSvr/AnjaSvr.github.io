import * as THREE from '../../libs/three/three.module.js';

class App{
	constructor(){

    var WIDTH = 640;
    var HEIGHT = 480;

    // Vanilla Three.js
    var renderer = new THREE.WebGLRenderer();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, .01, 1000);

    // Insert into document
    document.body.appendChild(renderer.domElement);

    // MathBox context
    var context = new MathBox.Context(renderer, scene, camera).init();
    var mathbox = context.api;

    // Set size
    renderer.setSize(WIDTH, HEIGHT);
    context.resize({ viewWidth: WIDTH, viewHeight: HEIGHT });

    // Place camera and set background
    camera.position.set(0, 0, 3);
    renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);

    // MathBox elements
    var view = mathbox
    .set({
      focus: 3,
    })
    .cartesian({
      range: [[-2, 2], [-1, 1], [-1, 1]],
      scale: [2, 1, 1],
    });

    view.axis({
      detail: 30,
    });

    view.axis({
      axis: 2,
    });
    
    view.scale({
      divide: 10,
    })
    view.ticks({
      classes: ['foo', 'bar'],
      width: 2
    });

    view.grid({
      divideX: 30,
      width: 1,
      opacity: 0.5,
      zBias: -5,
    });

    view.interval({
      id: 'sampler',
      width: 64,
      expr: function (emit, x, i, t) {
        y = Math.sin(x + t) * .7;
        emit(x, y);
      },
      channels: 2,
    });

    view.line({
      points: '#sampler',
      color: 0x3090FF,
      width: 5,
    });

    /*var frame = function () {
      requestAnimationFrame(frame);
      context.frame();
      renderer.render(scene, camera);
    };

    requestAnimationFrame(frame);
    */
   // Render frames
    var frame = function () {
    context.frame();
    renderer.render(scene, camera);
    };
     requestAnimationFrame(frame);
   
  }

  
    
}

export { App };