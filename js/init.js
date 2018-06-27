
function init(){
    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    renderer = new THREE.WebGLRenderer({antialias:true}); 
    renderer.setSize( WIDTH, HEIGHT ); 
    document.body.appendChild( renderer.domElement );


    /* CAMERA */
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
    camera.position.set( 0, 0, 0 );
    camera.lookAt(0,40,0);
    scene.add(camera);

    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());
    controls.getObject().position.y = blockDim * 0.65;

    /* CONTROLS */
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if ( havePointerLock ) {
        var element = document.body;
        var pointerlockchange = function ( event ) {
            if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
                controlsEnabled = true;
                controls.enabled = true;
            } else {
                controls.enabled = false;
            }
        };
        var pointerlockerror = function ( event ) {
        };
        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'click', function ( event ) {
            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();  
        }, false );
    } 

    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true; 
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
        }
    };
    var onKeyUp = function ( event ) {
        switch( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );


    /* FOG */
    if(!debug)
        scene.fog = new THREE.Fog(0x000000,60,150);


    /* MESHES */
    //geometry
    plane = new THREE.PlaneGeometry(blockDim,blockDim,1,1);
    //textures
    wallTexture = new THREE.TextureLoader().load( "textures/stonewall.jpeg" );
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set( 2, 2 );
    
    if(!debug)
        wallMaterial = new THREE.MeshLambertMaterial({map: wallTexture, transparent: true, opacity: 0.4}); //texture trasparente per debug
    else
        wallMaterial = new THREE.MeshLambertMaterial({map: wallTexture, side: THREE.DoubleSide});


    //PROVA SHADER MATERIAL
    var customUniforms = THREE.UniformsUtils.merge( [
        THREE.UniformsLib[ "lights" ],
        {
          blockDim: {value: blockDim},
          effect: {value: 0.0},
          tile: {value: new THREE.Vector2(2,2)},
          textureSampler: {type: 't', value: null},
          lightIntensity: {type: 'f', value: 1.0}
        }
    
    ] );

    
    wallMaterial = new THREE.ShaderMaterial({
            uniforms: customUniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent,
            lights: true,
            transparent: true
    });
    wallMaterial.uniforms.textureSampler.value = wallTexture;
    wallMaterial.needsUpdate = true;



    /* FLOOR */
    floorTexture = new THREE.TextureLoader().load( "textures/stonefloor.jpg" );
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 2, 2 );
    floorMaterial = new THREE.MeshLambertMaterial({map: floorTexture, side: THREE.DoubleSide});
    
/*
    var cube = new THREE.CubeGeometry(10,10,10);
    texture = new THREE.TextureLoader().load( "textures/crate.jpg" );
    material = new THREE.MeshPhongMaterial({map: texture});
    box = new THREE.Mesh( cube, material );
    
    //ruoto e traslo
    box.position.set(-blockDim/2+box.geometry.parameters.width/2,box.geometry.parameters.height/2,0);
  */

    /* INIZIALIZZO IL LABIRINTO */
    genBlock([0,0],[1,0,1,1]);
    
    for(var i = -halfGrid+1; i < 0; i++){
        genBlock([0,i],[1,0,1,0]);
        genLight([0,i],[0,-1]);
    }
    closestBlocks.push([0,-(halfGrid),0,-1]);

    //inizializzo gli id delle mesh del blocco in cui mi trovo
    wallsId = meshMap["0-0"].split("-").slice(2);


    /* LIGHTS */
    var ambLight = new THREE.AmbientLight( 0xffffff );    
}