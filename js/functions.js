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

    //determino e gestisco i muri liberi del nuovo blocco
    for(var i = 0; i < 4; i++){
        if(i != entrance){ //lascio libero l'ingresso
            walls[i] = Math.floor(Math.random()*2); //scelgo casualmente se il lato è libero o no
            //if(i != front) walls[i] = 1; //per debug
            if(walls[i] == 0){ //lato libero
                deadEnd = false; //so che senza contare da dove arrivo, c'è almeno un'altra parete libera
                
                //dovrei controllare se dove c'è un lato libero c'è già un blocco adiacente, in tal caso devo chiudere il lato
                var wallDir = freeWallToDirection(i);
                if(checkMap(mazeMap,sumArrays(blockPos,wallDir)))
                    freeWalls.push(i); //mi salvo gli indici dei lati liberi 
            }
            
        }
    }

    genBlock(blockPos,walls); //genero il blocco

    var newDir;
    var newBlockPos;
    var straight;
    var straightLength;
    for(var i = 0; i < freeWalls.length; i++){
        //genero un blocco a dritto
        straightLength = Math.floor(Math.random()*halfGrid);
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
    
        if(checkMap(mazeMap,newBlockPos))
            nextBlocks.push([newBlockPos[0],newBlockPos[1],newDir[0],newDir[1]]);  
    }
}

function getClosest(blocks){
    var pos = blocks[0].slice(0,2);
    var nearest = pos;
    var nearestIndex = 0;
    var dist = pointDistance(newGridPos,pos);
    var min = dist;

    for(var i = 1; i < blocks.length; i++){
        pos = nextBlocks[i].slice(0,2);
        dist = pointDistance(newGridPos,pos);
        if(dist < min){
            min = dist;
            nearest = pos;
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
        console.log("block: " + nearest + ", distance: " + pointDistance(nearest,newGridPos))
        nextBlocks.splice(nearestIndex,1);
        
        j++;  
    }
}

function clearGrid(pos,dir){
    var moveDir = (dir[0] == 0)? 1 : 0;
    var sideDir = (dir[0] == 0)? 0 : 1;

    //var moveSign = (moveDir == 0)? dir[moveDir] : dir[moveDir];

    //var backStep = pos[moveDir] - dir[moveDir]*halfGrid - dir[moveDir];
    var backStep = pos[moveDir] - dir[moveDir];
    var remPos = [0,0];
    //remPos[moveDir] = backStep;
    
    for(var i = 0; i <= halfGrid * 2; i++){
        for(var j = -halfGrid; j <= halfGrid; j++){
            remPos[sideDir] = (pos[sideDir] + j);
            remPos[moveDir] = backStep + (Math.abs(j) - halfGrid - i) * dir[moveDir];
            //console.log(remPos);
            
            if(!checkMap(meshMap,remPos)) remBlock(remPos);       
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
            //console.log(buildPos);
            if(!checkMap(mazeMap,buildPos)){
                
                newBlock = mazeMap[buildPos[0] + '-' + buildPos[1]];
                genBlock(buildPos,newBlock);
                //console.log("Built " + buildPos);
            }        
        }
    }
}