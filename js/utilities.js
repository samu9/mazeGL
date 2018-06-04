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

function checkGrid(pos){
    if((Math.abs(pos[0])>Math.abs(newGridPos[0])+halfGrid)||(Math.abs(pos[1])>Math.abs(newGridPos[1])+halfGrid)){
        console.log("Out of grid in: [" + pos[0] + "," + pos[1] + "]");
        return false;
    }
    return true;
}

function pointDistance(x,y){
    return Math.sqrt(Math.pow((x[0] - y[0]),2) + Math.pow((x[1] - y[1]),2));
}

function reorderBlocks(){
    if(nextBlocks.length <= 1)
        return;
    var pos = nextBlocks[0].slice(0,2);
    var min = pointDistance(newGridPos,pos);
    var dist;
    var nearest = pos;
    var nearestIndex = 0;
    
    for(var i = 1; i < nextBlocks.length; i++){
        pos = nextBlocks[i].slice(0,2);
        dist = pointDistance(newGridPos,pos);
        if(dist < min){
            min = dist;
            nearest = pos;
            nearestIndex = i;
        }
    }
    nextBlocks.splice(nearestIndex, 0, nextBlocks.splice(0, 1)[0]);
    console.log("nearest: " + nearest);
    return nearest;
}