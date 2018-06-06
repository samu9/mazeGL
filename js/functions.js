function genBlock(pos,wallsFlag){
    //se il blocco esiste già oppure è fuori dalla griglia non lo creo 
    if(!checkMap(meshMap,pos))
        return false;

    var walls = [];

    //left (looking in the direction of negative z)
    walls[0] = new THREE.Mesh(plane,wallMaterial);
    walls[0].position.set(-blockDim/2 + (pos[0]*blockDim),blockDim/2,(pos[1]*blockDim));
    walls[0].rotation.set(0,Math.PI/2,0);

    //front (looking in the direction of negative z)
    walls[1] = new THREE.Mesh(plane,wallMaterial);
    walls[1].position.set((pos[0]*blockDim),blockDim/2,-blockDim/2 + (pos[1]*blockDim));
    walls[1].rotation.set(0,Math.PI,0);

    //right (looking in the direction of negative z)
    walls[2] = new THREE.Mesh(plane,wallMaterial);
    walls[2].position.set(blockDim/2 + (pos[0]*blockDim),blockDim/2,(pos[1]*blockDim));
    walls[2].rotation.set(0,Math.PI/2,0);

    //back (looking in the direction of negative z)
    walls[3] = new THREE.Mesh(plane,wallMaterial);
    walls[3].position.set((pos[0]*blockDim),blockDim/2,+blockDim/2 + (pos[1]*blockDim));
    walls[3].rotation.set(0,Math.PI,0);

    //floor and ceiling
    var floor = new THREE.Mesh(plane, floorMaterial);
    var ceiling = new THREE.Mesh(plane, wallMaterial);
    floor.position.set((pos[0]*blockDim),0,(pos[1]*blockDim));
    floor.rotation.set(Math.PI/2,0,0);
    ceiling.position.set((pos[0]*blockDim),blockDim,(pos[1]*blockDim));   
    ceiling.rotation.set(Math.PI/2,0,0);

    scene.add(floor);
    scene.add(ceiling);

    meshMap[pos[0] + "-" + pos[1]] = floor.id + "-" + ceiling.id;
    mazeMap[pos[0] + "-" + pos[1]] = wallsFlag;

    for(var i = 0; i < 4; i++){
        if(wallsFlag[i] == 1){
            scene.add(walls[i]);
            meshMap[pos[0] + "-" + pos[1]] += "-" + walls[i].id;
        }
            delete walls[i];
    }

    delete floor;
    delete ceiling;
    plane.dispose();
    wallMaterial.dispose();
    floorMaterial.dispose();

    console.log("block generated at x:" + pos[0] + ", z: " + pos[1]);
    return true; 
}

function remBlock(bX, bZ){
    //se il blocco è già vuoto
    if(checkMap(meshMap,[bX,bZ]))
        return false;

    console.log("block deleted at x:" + bX + ", z: " + bZ);
    var remIds = meshMap[bX + "-" + bZ].split("-");
    var object;
    for(var i = 0; i < remIds.length; i++){
        object = scene.getObjectById(parseInt(remIds[i]));
        object.geometry.dispose();
        object.material.dispose();
        scene.remove(object);
        delete object;
    }
    delete meshMap[bX + "-" + bZ];
    
    return true;
}

function labyrinth(){
    if(nextBlocks.length == 0)
        return;

    var temp = nextBlocks.shift();
    var blockPos = temp.slice(0,2);

    if(!checkGrid(blockPos)){ //non sono riuscito a creare il blocco (perchè è fuori dalla mia griglia), lo rimetto in pila
        nextBlocks.unshift(temp);
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

    //determino e gestisco i muri liberi del nuovo blocco
    for(var i = 0; i < 4; i++){
        if(i != entrance){ //lascio libero l'ingresso
            walls[i] = 0;//Math.floor(Math.random()*2); //scelgo casualmente se il lato è libero o no
            //if(i == front || i == left) walls[i] = 1; //per debug
            if(walls[i] == 0){ //lato libero
                deadEnd = false; //so che senza contare da dove arrivo, c'è almeno un'altra parete libera
                
                //dovrei controllare se dove c'è un lato libero c'è già un blocco adiacente, in tal caso devo chiudere il lato
                var wallDir = freeWallToDirection(i);
                if(checkMap(mazeMap,sumArrays(blockPos,wallDir)))
                    freeWalls.push(i); //mi salvo gli indici dei lati liberi 
            }
            
        }
    }
    console.log(walls);

    genBlock(blockPos,walls); //genero il blocco

    var newDir;
    var newBlockPos;
    var straight;
    var straightLength;
    for(var i = 0; i < freeWalls.length; i++){
        straightLength = Math.floor(Math.random()*halfGrid);
        console.log("straight: " + straightLength);
        //genero un blocco a dritto
        newBlockPos = blockPos;
        newDir = freeWallToDirection(freeWalls[i]);
        straight = (newDir[0] == 0)? [1,0,1,0] : [0,1,0,1];
        newBlockPos = sumArrays(newBlockPos,newDir);
        
        if(!genBlock(newBlockPos,straight)) break;
        newBlockPos = sumArrays(newBlockPos,newDir);

        for(var l = 1; l <= straightLength; l++){
            if(!checkMap(mazeMap,newBlockPos)) break;
            if(checkMap(mazeMap,sumArrays(newBlockPos,newDir))){
                if(!genBlock(newBlockPos,straight)) break;
                newBlockPos = sumArrays(newBlockPos,newDir);
            }
        }
    
        if(checkMap(mazeMap,newBlockPos)){
            nextBlocks.push([newBlockPos[0],newBlockPos[1],newDir[0],newDir[1]]);
            console.log("pushed: " + [newBlockPos[0],newBlockPos[1],newDir[0],newDir[1]]);
            //labyrinth();
        }
    }
}


function clearGrid(pos,dir){
    var moveDir = (dir[0] == 0)? 1 : 0;
    var sideDir = (dir[0] == 0)? 0 : 1;
    var start = pos[sideDir] - halfGrid;
    var end = pos[sideDir] + halfGrid;

    var axis = pos[moveDir] - dir[moveDir]*halfGrid - dir[moveDir];

    for(var j = start; j <= end; j++){
        if(moveDir == 1){
            remBlock(j,axis);

        }
        else
            remBlock(axis,j);   
    }
}