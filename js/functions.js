function genBlock(pos,wallsFlag){
    //se il blocco esiste già non lo creo 
    if(!checkMap(meshMap,pos))
        return false;

    //floor and ceiling
    var floor = new THREE.Mesh(plane, wallMaterial);
    var ceiling = new THREE.Mesh(plane, wallMaterial);

    floor.position.set((pos[0]*blockDim),0,(pos[1]*blockDim));
    floor.rotation.set(Math.PI/2,Math.PI,0);
    floor.castShadow = true;
    floor.receiveShadow = true;

    ceiling.position.set((pos[0]*blockDim),blockDim,(pos[1]*blockDim));   
    ceiling.rotation.set(Math.PI/2,0,0);
    ceiling.castShadow = true;
    ceiling.receiveShadow = true;

    scene.add(floor);
    scene.add(ceiling);

    meshMap[pos[0] + "-" + pos[1]] = floor.id + "-" + ceiling.id;

    var walls = [];
    var object;
    if(wallsFlag[0] == 1){
        //left (looking in the direction of negative z)
        object = new THREE.Mesh(plane,wallMaterial);
        object.position.set(-blockDim/2 + (pos[0]*blockDim),blockDim/2,(pos[1]*blockDim));
        object.rotation.set(0,Math.PI/2,0);
        object.matrixAutoUpdate  = true;
        object.castShadow = true;
        object.receiveShadow = true;
        meshMap[pos[0] + "-" + pos[1]] += "-" + object.id;
        scene.add(object);
    }
    if(wallsFlag[1] == 1){
        //front (looking in the direction of negative z)
        object = new THREE.Mesh(plane,wallMaterial);
        object.position.set((pos[0]*blockDim),blockDim/2,-blockDim/2 + (pos[1]*blockDim));
        object.rotation.set(0,0,0);
        object.matrixAutoUpdate  = true;
        object.castShadow = true;
        object.receiveShadow = true;
        meshMap[pos[0] + "-" + pos[1]] += "-" + object.id;
        scene.add(object);
    }
    if(wallsFlag[2] == 1){
        //right (looking in the direction of negative z)
        object = new THREE.Mesh(plane,wallMaterial);
        object.position.set(blockDim/2 + (pos[0]*blockDim),blockDim/2,(pos[1]*blockDim));
        object.rotation.set(0,-Math.PI/2,0);
        object.matrixAutoUpdate  = true;
        object.castShadow = true;
        object.receiveShadow = true;
        meshMap[pos[0] + "-" + pos[1]] += "-" + object.id;
        scene.add(object);
    }
    if(wallsFlag[3] == 1){
        //back (looking in the direction of negative z)
        object = new THREE.Mesh(plane,wallMaterial);
        object.position.set((pos[0]*blockDim),blockDim/2,+blockDim/2 + (pos[1]*blockDim));
        object.rotation.set(0,Math.PI,0);
        object.matrixAutoUpdate  = true;
        object.castShadow = true;
        object.receiveShadow = true;
        meshMap[pos[0] + "-" + pos[1]] += "-" + object.id;
        scene.add(object);
    }

    mazeMap[pos[0] + "-" + pos[1]] = wallsFlag;

    delete floor;
    delete ceiling;
    delete object;
    plane.dispose();
    wallMaterial.dispose();
    floorMaterial.dispose();

    return true; 
}

function remBlock(pos){
    //se il blocco è già vuoto
    if(checkMap(meshMap,[pos[0],pos[1]]))
        return false;

    var remIds = meshMap[pos[0] + "-" + pos[1]].split("-");
    var object;
    for(var i = 0; i < remIds.length; i++){
        object = scene.getObjectById(parseInt(remIds[i]));
        object.geometry.dispose();
        object.material.dispose();
        scene.remove(object);
        delete object;
    }
    delete meshMap[pos[0] + "-" + pos[1]];
    
    return true;
}

function genLight(pos,dir){
    if(!checkMap(lightMap,pos)) return;

    var lightDistFromWall = 0.85;
    var lightHeight = 0.7;

    var posX = (dir[0] != 0)? pos[0]*blockDim : pos[0]*blockDim + halfBlock * lightDistFromWall;
    var posZ = (dir[1] != 0)? pos[1]*blockDim : pos[1]*blockDim + halfBlock * lightDistFromWall;
    var light = new THREE.PointLight(lightColor);
    light.position.set( posX, blockDim * lightHeight, posZ );
    light.castShadow = true;
    //light.shadow.mapSize.width = 512;  // default
    //light.shadow.mapSize.height = 512; // default
    //light.shadow.camera.near = 0.5;       // default
    //light.shadow.camera.far = 500      // default


       
    var torchModel = model3d.clone();
    //torchModel.copy(model);
    torchModel.scale.set(0.1,0.1,0.1);
    torchModel.position.set( posX, blockDim * 0.53, posZ );
    
    scene.add(light);  
    scene.add( torchModel );
    
    delete light;
    delete torchModel;

    lightMap[pos[0] + "-" + pos[1]] = light.id + "-" + torchModel.id;   
}

function remLight(pos){
    //se il blocco è già vuoto
    if(checkMap(lightMap,[pos[0],pos[1]])) return false;

    var remIds = lightMap[pos[0] + "-" + pos[1]].split("-");
    var object;
    for(var i = 0; i < remIds.length; i++){
        object = scene.getObjectById(parseInt(remIds[i]));
        scene.remove(object);
        delete object;
    }
    delete lightMap[pos[0] + "-" + pos[1]];
    
    return true;
}

function labyrinth(){
    if(closestBlocks.length == 0)
        return;

    var temp = closestBlocks.shift();
    var blockPos = temp.slice(0,2);

    //console.log("extracted: " + blockPos);

    if(!checkGrid(blockPos)){ //non sono riuscito a creare il blocco (perchè è fuori dalla mia griglia), lo rimetto in pila
        nextBlocks.push(temp);
        return;
    }

    if(!checkMap(mazeMap,blockPos))
        return;

        //devo controllare: se è in mazeMap ma non in meshMap devo ricostruirlo, se è anche in meshMap annullo, altrimenti lo genero

    var dir = temp.slice(2,4); //in che direzione si entra nel blocco

    //determino l'ingresso del blocco che vado a creare
    var entrance = directionToWall(dir);
    var deadEnd = true;
    var freeWalls = [];
    var walls = [0,0,0,0];
    var front = (entrance + 2) % 4;
    var left = (entrance + 1) % 4;
    var right = (entrance + 3) % 4;

    var wallDir;
    //determino e gestisco i muri liberi del nuovo blocco
    for(var i = 0; i < 4; i++){
        if(i != entrance){ //lascio libero l'ingresso
            wallDir = freeWallToDirection(i);
            if(checkMap(mazeMap,sumArrays(blockPos,wallDir))){
                //se non ci sono altre vie libere faccio in modo che il labirinto continui
                walls[i] = (nextBlocks.length == 0)? 0 : Math.floor(Math.random()*2); //scelgo casualmente se il lato è libero o no
                //if(i == left || i == right) walls[i] = 1; //per debug
                if(walls[i] == 0){ //lato libero 
                    freeWalls.push(i); //mi salvo gli indici dei lati liberi
                    deadEnd = false; //so che senza contare da dove arrivo, c'è almeno un'altra parete libera
                }
            }
            else
                walls[i] = 1; //se il blocco adiacente non è libero chiudo il lato  
        }
    }

    genBlock(blockPos,walls); //genero il blocco

    var newDir;
    var newBlockPos;
    var straight;
    var endStraight;
    var straightLength;
    for(var i = 0; i < freeWalls.length; i++){
        //genero un blocco a dritto
        straightLength = Math.floor(Math.random()*halfGrid);
        newBlockPos = blockPos;
        newDir = freeWallToDirection(freeWalls[i]);
        straight = (newDir[0] == 0)? [1,0,1,0] : [0,1,0,1];
        endStraight = Array.from(straight);
        endStraight[directionToWall(newDir.map(value => -value))] = 1; //blocco a dritto chiuso alla fine a seconda della direzione (negata in questo caso)
        newBlockPos = sumArrays(newBlockPos,newDir);
        
        // genero i blocchi "a dritto" - voglio che almeno un blocco venga generato in modo gestire meglio le ramificazioni
        var l = 0;
        do{
            if(!checkMap(mazeMap,newBlockPos)) break;
            if(checkMap(mazeMap,sumArrays(newBlockPos,newDir))){
                if(!genBlock(newBlockPos,straight)) break;
                else genLight(newBlockPos,newDir);
                newBlockPos = sumArrays(newBlockPos,newDir);
            }
            else if(l == 0){
                if(!genBlock(newBlockPos,endStraight)) break;
                else genLight(newBlockPos,newDir);
                newBlockPos = sumArrays(newBlockPos,newDir);
                break;
            }
            l++;
        } while(l <= straightLength);

        if(checkMap(mazeMap,newBlockPos))
            nextBlocks.push([newBlockPos[0],newBlockPos[1],newDir[0],newDir[1]]);  
    }
}

function getClosest(blocks){
    var pos = blocks[0].slice(0,2);
    //var nearest = pos;
    var nearestIndex = 0;
    var dist = pointDistance(newGridPos,pos);
    var min = dist;

    for(var i = 1; i < blocks.length; i++){
        pos = nextBlocks[i].slice(0,2);
        dist = pointDistance(newGridPos,pos);
        if(dist < min){
            min = dist;
            //nearest = pos;
            nearestIndex = i;
        }
    }
    return nearestIndex;
}


function reorderBlocks(){
    if(nextBlocks.length == 0)
        return;

    //console.log("nextBlocks: " + nextBlocks);
    
    while(closestBlocks.length > 0)
        nextBlocks.push(closestBlocks.pop())
    
    var pos, min, dist, nearest, nearestIndex,element;
    var j = 0;

    while(j < 3 && nextBlocks.length > 0){
        pos = nextBlocks[0].slice(0,2);
        min = pointDistance(newGridPos,pos);
        nearest = pos;
        nearestIndex = 0;
        
        for(var i = 1; i < nextBlocks.length; i++){
            pos = nextBlocks[i].slice(0,2);
            dist = pointDistance(newGridPos,pos);
            if(dist < min){
                min = dist;
                nearest = pos;
                nearestIndex = i;
            }
        }
        
        if(!checkGrid(nearest)) //se il più vicino trovato è fuori dalla griglia lo lascio in nextBlocks
            return;
        
        closestBlocks.push(nextBlocks[nearestIndex]); //prendo l'indice del blocco più vicino e lo metto in closestBlocks
        //console.log("block: " + nearest + ", distance: " + pointDistance(nearest,newGridPos))
        nextBlocks.splice(nearestIndex,1);
        
        j++;  
    }
}

function clearGrid(pos,dir){
    var moveDir = (dir[0] == 0)? 1 : 0;
    var sideDir = (dir[0] == 0)? 0 : 1;
    var backStep = pos[moveDir] - dir[moveDir];
    var remPos = [0,0];
    
    for(var i = 0; i <= halfGrid * 2; i++){
        for(var j = -halfGrid; j <= halfGrid; j++){
            remPos[sideDir] = (pos[sideDir] + j);
            remPos[moveDir] = backStep + (Math.abs(j) - halfGrid - i) * dir[moveDir];
            
            if(!checkMap(meshMap,remPos)){
                remBlock(remPos); 
                remLight(remPos);
            }    
        }
    }
}


function buildGrid(pos,dir){
    var moveDir = (dir[0] == 0)? 1 : 0;
    var sideDir = (dir[0] == 0)? 0 : 1;

    var newBlock;
    var buildPos = [0,0];    
    for(var i = 0; i <= halfGrid; i++){
        for(var j = -halfGrid; j <= halfGrid; j++){
            buildPos[sideDir] = (pos[sideDir] + j);
            buildPos[moveDir] = pos[moveDir] + (halfGrid - Math.abs(j) + i) * dir[moveDir];

            if(!checkMap(mazeMap,buildPos)){ 
                newBlock = mazeMap[buildPos[0] + '-' + buildPos[1]];
                genBlock(buildPos,newBlock);
                if(arraysEqual(newBlock,[0,1,0,1]))
                    genLight(buildPos,freeWallToDirection(0));
                else if(arraysEqual(newBlock,[1,0,1,0]))
                    genLight(buildPos,freeWallToDirection(1));
            }        
        }
    }
}

function checkCollision(){
    var cameraDirection = controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();
    var rotationMatrix;

    velocity.x = 0;
    velocity.z = 0;

    var rotation = 0;
    var pressedKeys = 0;

    if (moveForward) {
        velocity.z -= camSpeed;
        pressedKeys++;
    }
    if (moveBackward) {
        rotation += 180;
        velocity.z += camSpeed;
        pressedKeys++;
    }
    if (moveLeft) {
        rotation += 90;
        velocity.x -= camSpeed;
        pressedKeys++;
    }
    if (moveRight) {
        // non so perchè ma avanti e destra con 270 o indietro e destra insieme con -90 non fuziona correttamente
        if(moveForward) rotation += -90;
        else if(moveBackward) rotation += 270;
        else rotation += -90;
        velocity.x += camSpeed;
        pressedKeys++;
    }

    if(!moveForward && !moveBackward && !moveLeft && !moveRight) return;


    if (rotation != 0){
        rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY((rotation / pressedKeys) * Math.PI / 180);
        cameraDirection.applyMatrix4(rotationMatrix);
    }
    if(!wallsId){
        controls.getObject().translateX( -velocity.x*2);
        controls.getObject().translateZ( -velocity.z*2);
        return; 
    }
    if(wallsId.length == 0){
        controls.getObject().translateX( velocity.x);
        controls.getObject().translateZ( velocity.z);
        return;
    }

    var walls = [];
    for(var i = 0; i < wallsId.length; i++)
        walls.push(scene.getObjectById(parseInt(wallsId[i])))

    var rayCaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);
    var intersects = rayCaster.intersectObjects(walls, false);
    if(intersects.length == 0 || intersects[0].distance > wallEdge){
        controls.getObject().translateX( velocity.x);
        controls.getObject().translateZ( velocity.z);
        return;
    }
}