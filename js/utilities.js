function sumArrays(a,b){
    return [a[0]+b[0],a[1]+b[1]];
}


//se il punto nella mappa è libero ritorna true
function checkMap(map,pos){
    return !(pos[0] + "-" + pos[1] in map);
}

//da un id del lato ottengo la direzione verso il lato libero
function freeWallToDirection(w){
    if(w > 3) return [0,0];
    var dir = 
        (w == 0)? [-1,0] : 
        (w == 1)? [0,-1] : 
        (w == 2)? [1,0] : [0,1];
    return dir;
}

//da una direzione ottengo l'id del lato
function directionToWall(dir){
    if(dir.length > 2 || dir.length < 2) return null;
    var wall = 
    (dir[0] == 1)? 0 : 
    (dir[1] == 1)? 1 : 
    (dir[0] == -1)? 2 : 3;
    return wall;
}

//verifica se la posizione è all'interno della mia griglia
function checkGrid(pos){
    //if((Math.abs(pos[0])>Math.abs(newGridPos[0])+halfGrid)||(Math.abs(pos[1])>Math.abs(newGridPos[1])+halfGrid)){
    return (pointDistance(pos,newGridPos) <= halfGrid)
        //console.log("Out of grid in: [" + pos[0] + "," + pos[1] + "]");
}

//distanza tra due punti
function pointDistance(x,y){
    return Math.sqrt(Math.pow((x[0] - y[0]),2) + Math.pow((x[1] - y[1]),2));
}