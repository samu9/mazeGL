
function init(){
    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    renderer = new THREE.WebGLRenderer({antialias:true}); 
    renderer.setSize( WIDTH, HEIGHT ); 
    document.body.appendChild( renderer.domElement );

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


    //geometry
    plane = new THREE.PlaneBufferGeometry(roomW, roomH, 8, 8);
    //textures
    wallTexture = new THREE.TextureLoader().load( "textures/stonewall.jpeg" );
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set( 4, 4 );
    //wallMaterial = new THREE.MeshLambertMaterial({map: wallTexture, side: THREE.DoubleSide});
    wallMaterial = new THREE.MeshLambertMaterial({map: wallTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.4}); //texture trasparente per debug

    floorTexture = new THREE.TextureLoader().load( "textures/stonefloor.png" );
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 16, 16 );
    floorMaterial = new THREE.MeshLambertMaterial({map: floorTexture, side: THREE.DoubleSide});
    
/*
    var cube = new THREE.CubeGeometry(10,10,10);
    texture = new THREE.TextureLoader().load( "textures/crate.jpg" );
    material = new THREE.MeshPhongMaterial({map: texture});
    box = new THREE.Mesh( cube, material );
    
    //ruoto e traslo
    box.position.set(-roomW/2+box.geometry.parameters.width/2,box.geometry.parameters.height/2,0);
  */

    genBlock([0,0],[1,0,1,1]);
    for(var i = -halfGrid+1; i < 0; i++)
        genBlock([0,i],[1,0,1,0]);
        //genBlock(0,i,0);
    nextBlocks.push([0,-(halfGrid),0,-1]);



    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());
    //scene.fog = new THREE.Fog(0x000000,60,150);
    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true; break;
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

    controls.getObject().position.y = 30;


    var light = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add( light );
}