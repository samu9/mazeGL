
function init(){
    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;


    /* RENDERER */
    renderer = new THREE.WebGLRenderer({antialias:true}); 
    renderer.setSize( WIDTH, HEIGHT ); 
    document.body.appendChild( renderer.domElement );


    /* CAMERA */
    camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, 1000 ); 
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
    controls.getObject().position.y = blockDim * camHeight;

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
    scene.fog = new THREE.Fog(0x000000,80,150);


    /* MESHES */
    plane = new THREE.PlaneBufferGeometry(blockDim,blockDim,1,1);

    cylinder1 = new THREE.CylinderGeometry( 1.5, 1.5, 3, 32 );
    cylinder2 = new THREE.CylinderGeometry( 1, 0.5, 10, 32 );
    torch = new THREE.Geometry();
    var torch1 = new THREE.Mesh(cylinder1);
    var torch2 = new THREE.Mesh(cylinder2);
    torch1.position.set(0,6.5,0);
    torch1.updateMatrix();
    torch.merge(torch1.geometry,torch1.matrix,1);
    torch2.updateMatrix();
    torch.merge(torch2.geometry,torch2.matrix,1);


    /* TEXTURES */
    wallTexture = new THREE.TextureLoader().load( "textures/stonewall.jpeg" );
    torchTexture = new THREE.TextureLoader().load( "textures/wood.jpg" );

    /* SHADER MATERIAL */
    var customUniforms = THREE.UniformsUtils.merge( [
        THREE.UniformsLib["lights"],
        THREE.UniformsLib["shadowmap"],
        {
            topColor:    { type: "c", value: new THREE.Color( 0x0077ff ) },
            bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
            offset:      { type: "f", value: 33 },
            exponent:    { type: "f", value: 0.6 },
            fogColor:    { type: "c", value: scene.fog.color },
            fogNear:     { type: "f", value: scene.fog.near },
            fogFar:      { type: "f", value: scene.fog.far },
            blockDim: {value: blockDim},
            effect: {value: 0.0},
            tile: {value: new THREE.Vector2(2,2)},
            textureSampler: {type: 't', value: null},
            lightIntensity: {type: 'f', value: 1.0}
        }
    
    ] );

    var customUniforms1 = THREE.UniformsUtils.merge( [
        THREE.UniformsLib["lights"],
        THREE.UniformsLib["shadowmap"],
        {
            topColor:    { type: "c", value: new THREE.Color( 0x0077ff ) },
            bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
            offset:      { type: "f", value: 33 },
            exponent:    { type: "f", value: 0.6 },
            fogColor:    { type: "c", value: scene.fog.color },
            fogNear:     { type: "f", value: scene.fog.near },
            fogFar:      { type: "f", value: scene.fog.far },
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
            transparent: true,
            fog: true
    });
    wallMaterial.uniforms.textureSampler.value = wallTexture;
    wallMaterial.needsUpdate = true;


    torchMaterial = new THREE.ShaderMaterial({
        uniforms: customUniforms1,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        lights: true,
        transparent: true,
        fog: true
    });
    torchMaterial.uniforms.textureSampler.value = torchTexture;
    torchMaterial.needsUpdate = true;
    


    /* INITIALIZING THE MAZE */
    genBlock([0,0],[1,0,1,1]);
    for(var i = -halfGrid+1; i < 0; i++){
        genBlock([0,i],[1,0,1,0]);
        genLight([0,i],[0,-1]);
    }
    closestBlocks.push([0,-(halfGrid),0,-1]);


    wallsId = meshMap["0-0"].split("-").slice(2);
  

    updateInfo();
}