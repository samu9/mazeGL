function sumArrays(a,b){
    return [a[0]+b[0],a[1]+b[1]];
}

//returns true if map is free in that pos
function checkMap(map,pos){
    return !(pos[0] + "-" + pos[1] in map);
}

//from free wall id to direction
function freeWallToDirection(w){
    if(w > 3) return [0,0];
    var dir = 
        (w == 0)? [-1,0] : 
        (w == 1)? [0,-1] : 
        (w == 2)? [1,0] : [0,1];
    return dir;
}

function directionToWall(dir){
    if(dir.length > 2 || dir.length < 2) return null;
    var wall = 
    (dir[0] == 1)? 0 : 
    (dir[1] == 1)? 1 : 
    (dir[0] == -1)? 2 : 3;
    return wall;
}

//check if pos is inside the rendering grid
function checkGrid(pos){
    //if((Math.abs(pos[0])>Math.abs(newGridPos[0])+halfGrid)||(Math.abs(pos[1])>Math.abs(newGridPos[1])+halfGrid)){
    return (pointDistance(pos,newGridPos) <= halfGrid)
}


function pointDistance(x,y){
    return Math.sqrt(Math.pow((x[0] - y[0]),2) + Math.pow((x[1] - y[1]),2));
}

function arraysEqual(a1,a2){
    if(a1.length != a2.length) return false;
    for(var i = 0; i < a1.length; i++)
        if(a1[i] != a2[i]) return false;
    return true;
}

 function updateInfo(){
     /*
    var temp = "closestBlocks:<br>";
    for(var i = 0; i < closestBlocks.length; i++)
        temp += closestBlocks[i] + "<br>";

    temp += "nextBlocks:<br>";
    for(var i = 0; i < nextBlocks.length; i++)
        temp += nextBlocks[i] + "<br>"; 
    */
    paramBox.innerHTML = "gridX: " + newGridPos[0] + "<br>" + "gridZ: " + newGridPos[1];// + "<br>" + temp;
 }