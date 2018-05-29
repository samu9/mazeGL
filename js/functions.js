function genBlock(bX, bZ,type,angle){
    if(bX + "-" + bZ in map)
        return;
    
    var wallTexture, floorTexture, wallMaterial, floorMaterial;
    var leftWall, rightWall, frontWall;
    //var blockGeometry = new THREE.Geometry();
    //walls
    wallTexture = new THREE.TextureLoader().load( "textures/stonewall.jpeg" );
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set( 4, 4 );
    wallMaterial = new THREE.MeshLambertMaterial({map: wallTexture, side: THREE.DoubleSide});
    
    var wallGeometry = new THREE.PlaneGeometry(roomH, roomH, 80, 80);
    //wall.translate(-roomW/2 + (bX*roomW),roomW/2,(bZ*roomH));
    //wall.rotateY(Math.PI/2);
    //blockGeometry.merge(rightWall.geometry,rightWall.matrix);
    //var block = new THREE.Mesh(blockGeometry, wallMaterial);

    //floor and ceiling
    floorTexture = new THREE.TextureLoader().load( "textures/stonefloor.png" );
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 16, 16 );
    floorMaterial = new THREE.MeshLambertMaterial({map: floorTexture, side: THREE.DoubleSide});
    var plane = new THREE.PlaneBufferGeometry(roomW, roomH, 8, 8);
    var floor = new THREE.Mesh(plane, floorMaterial);
    var ceiling = new THREE.Mesh(plane, wallMaterial);

    //ruoto e traslo 
    floor.position.set((bX*roomW),0,(bZ*roomH));
    floor.rotation.set(Math.PI/2,0,0);
    ceiling.position.set((bX*roomW),roomH,(bZ*roomH));   
    ceiling.rotation.set(Math.PI/2,0,0);

    scene.add(floor);
    scene.add(ceiling);

    
    switch (type){
        case 0: //dritto
            leftWall = new THREE.Mesh(wallGeometry,wallMaterial);
            rightWall = new THREE.Mesh(wallGeometry,wallMaterial);
            leftWall.position.set(-roomW/2 + (bX*roomW),roomW/2,(bZ*roomH));
            leftWall.rotation.set(0,Math.PI/2,0);
            rightWall.position.set(roomW/2 + (bX*roomW),roomW/2,(bZ*roomH));
            rightWall.rotation.set(0,Math.PI/2,0);
            scene.add(leftWall);
            scene.add(rightWall);
            map[bX + "-" + bZ] = floor.id + "-" + leftWall.id + "-" + rightWall.id + "-" + ceiling.id;
            break;
        case 1: //svolta a sinistra
            rightWall = new THREE.Mesh(wallGeometry,wallMaterial);
            frontWall = new THREE.Mesh(wallGeometry,wallMaterial);
            frontWall.position.set((bX*roomW),roomW/2,- roomW/2 + (bZ*roomH));
            frontWall.rotation.set(0,Math.PI,0);
            rightWall.position.set(roomW/2 + (bX*roomW),roomW/2,(bZ*roomH));
            rightWall.rotation.set(0,Math.PI/2,0);
            scene.add(rightWall);
            scene.add(frontWall);
            map[bX + "-" + bZ] = floor.id + "-" + rightWall.id + "-" + frontWall.id + "-" + ceiling.id;
            break;
        case 2: //svolta a destra
            leftWall = new THREE.Mesh(wallGeometry,wallMaterial);
            frontWall = new THREE.Mesh(wallGeometry,wallMaterial);
            frontWall.position.set((bX*roomW),roomW/2,-roomH/2 + (bZ*roomH));
            frontWall.rotation.set(0,Math.PI,0);
            leftWall.position.set(-roomW/2 + (bX*roomW),roomW/2,(bZ*roomH));
            leftWall.rotation.set(0,Math.PI/2,0);
            scene.add(frontWall);
            scene.add(rightWall);
            map[bX + "-" + bZ] = floor.id + "-" + frontWall.id + "-" + leftWall.id + "-" + ceiling.id;
            break;
        case 3: //bivio
            frontWall = new THREE.Mesh(wallGeometry,wallMaterial);
            frontWall.position.set((bX*roomW),roomW/2,-roomH/2 + (bZ*roomH));
            frontWall.rotation.set(0,Math.PI,0);
            scene.add(frontWall);
            map[bX + "-" + bZ] = floor.id + "-" + "-" + frontWall.id + "-" + ceiling.id;
            break;
        case 4: //vicolo cieco
            leftWall = new THREE.Mesh(wallGeometry,wallMaterial);
            rightWall = new THREE.Mesh(wallGeometry,wallMaterial);
            frontWall = new THREE.Mesh(wallGeometry,wallMaterial);
            leftWall.position.set(-roomW/2 + (bX*roomW),roomW/2,(bZ*roomH));
            leftWall.rotation.set(0,Math.PI/2,0);
            rightWall.position.set(roomW/2 + (bX*roomW),roomW/2,(bZ*roomH));
            rightWall.rotation.set(0,Math.PI/2,0);
            frontWall.position.set((bX*roomW),roomW/2,-roomH/2 + (bZ*roomH));
            frontWall.rotation.set(0,Math.PI,0);
            scene.add(leftWall);
            scene.add(rightWall);
            scene.add(frontWall);
            map[bX + "-" + bZ] = floor.id + "-" + leftWall.id + "-" + rightWall.id + "-" + ceiling.id + "-" + frontWall.id;
            break;
        case 5: //dritto di lato
            leftWall = new THREE.Mesh(wallGeometry,wallMaterial);
            rightWall = new THREE.Mesh(wallGeometry,wallMaterial);
            leftWall.position.set((bX*roomW),roomW/2,-roomH/2 + (bZ*roomH));
            leftWall.rotation.set(0,Math.PI,0);
            rightWall.position.set((bX*roomW),roomW/2,roomH/2 + (bZ*roomH));
            rightWall.rotation.set(0,Math.PI,0);
            scene.add(leftWall);
            scene.add(rightWall);
            map[bX + "-" + bZ] = floor.id + "-" + leftWall.id + "-" + rightWall.id + "-" + ceiling.id;
            break;
    }


    //light = new THREE.PointLight( 0xffffff, 0.5, 120, 1 );
    //light.position.set((bX*roomW),25,(bZ*roomH) );


    
    ids.innerHTML = map[bX + "-" + bZ];


    //scene.add(blockGeometry);
    //scene.add(light);

    console.log("block generated at x:" + bX + ", z: " + bZ);
}
function remBlock(bX, bZ){
    if(!(bX + "-" + bZ in map))
        return;
    console.log("block deleted at x:" + bX + ", z: " + bZ);
    var remIds = map[bX + "-" + bZ].split("-");
    var object;
    for(var i = 0; i < remIds.length; i++){
        object = scene.getObjectById(parseInt(remIds[i]));
        object.geometry.dispose();
        scene.remove(scene.getObjectById(parseInt(remIds[i])));
    }
    delete map[bX + "-" + bZ];
    

}


function labyrinth(bX,bZ){
    var rand = Math.floor(Math.random() * 2);
    console.log("rand: " + rand);
    genBlock(bX,bZ,rand,0);
    if(rand == 1)
        genBlock(bX-1,bZ,5,0);
    
}