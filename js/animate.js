/*
var direction = 1;
function moveBox(){
    var boxW = box.geometry.parameters.width;
    
    //if((box.position.x - boxW/2) > -halfBlock && (box.position.x + boxW/2) < halfBlock)
        
    if((box.position.x + boxW/2) == halfBlock)
        direction = -1;
    else if((box.position.x - boxW/2) == -halfBlock)
        direction = 1;

    box.position.x += direction;
}
*/
function animate() {
    requestAnimationFrame( animate ); 
    stats.begin();

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;
    velocity.x -= velocity.x * 20.0 * delta;
    velocity.z -= velocity.z * 20.0 * delta;

    if ( moveForward ) velocity.z -= 800.0 * delta;
    if ( moveBackward ) velocity.z += 800.0 * delta;
    if ( moveLeft ) velocity.x -= 800.0 * delta;
    if ( moveRight ) velocity.x += 800.0 * delta;

    controls.getObject().translateX( velocity.x * delta );
    controls.getObject().translateZ( velocity.z * delta );

    prevTime = time;

    position = [(controls.getObject().position.x - halfBlock)/blockDim,(controls.getObject().position.z - halfBlock)/blockDim];
    newGridPos = [Math.floor(position[0]) + 1, Math.floor(position[1]) + 1];
    //console.log(newGridPos);
    reorderBlocks();
    
    var direction;
    if((gridPos[0] != newGridPos[0]) || (gridPos[1] != newGridPos[1])){
        direction = [newGridPos[0] - gridPos[0], newGridPos[1] - gridPos[1]];  
        labyrinth();
        //clearGrid(newGridPos,direction); 
        
        gridPos[0] = newGridPos[0];
        gridPos[1] = newGridPos[1];

        //stampo posizione e lista dei blocchi
        var temp = "";
        for(var i = 0; i < nextBlocks.length; i++)
            temp += "[" + nextBlocks[i][0] + "," + nextBlocks[i][1] + "," + nextBlocks[i][2] + "," + nextBlocks[i][3] + "]<br>"; 
        paramBox.innerHTML = "gridX: " + newGridPos[0] + "<br>" + "gridZ: " + newGridPos[1] + "<br>" + temp;
    }

    

    renderer.render( scene, camera );

    stats.end();
}