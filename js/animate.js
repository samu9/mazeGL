/*
var direction = 1;
function moveBox(){
    var boxW = box.geometry.parameters.width;
    
    //if((box.position.x - boxW/2) > -roomW/2 && (box.position.x + boxW/2) < roomW/2)
        
    if((box.position.x + boxW/2) == roomW/2)
        direction = -1;
    else if((box.position.x - boxW/2) == -roomW/2)
        direction = 1;

    box.position.x += direction;
}
*/
function animate() {
    requestAnimationFrame( animate ); 
    stats.begin();

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    if ( moveForward ) velocity.z -= 400.0 * delta;
    if ( moveBackward ) velocity.z += 400.0 * delta;
    if ( moveLeft ) velocity.x -= 400.0 * delta;
    if ( moveRight ) velocity.x += 400.0 * delta;

    controls.getObject().translateX( velocity.x * delta );
    controls.getObject().translateZ( velocity.z * delta );

    prevTime = time;
    //moveBox();
    var posX = Math.round(controls.getObject().position.x * 100) / 100;
    var posZ = Math.round(controls.getObject().position.z * 100) / 100;
    
    newGridPos = [Math.floor((posX - 25) / roomH) + 1, Math.floor((posZ - 25) / roomH) + 1];

    //console.log("x: " + gridPos[0] + " - z: " + gridPos[1]);
    
    var direction;
    if((gridPos[0] != newGridPos[0]) || (gridPos[1] != newGridPos[1])){
        direction = [newGridPos[0] - gridPos[0], newGridPos[1] - gridPos[1]]; 
        var remId = [gridPos[0] - direction[0] * Math.floor(gridDim/2), gridPos[1] - direction[1] * Math.floor(gridDim/2)];
        var genId = [gridPos[0] + direction[0] * Math.ceil(gridDim/2), gridPos[1] + direction[1] * Math.ceil(gridDim/2)];

        //console.log("remx: " + remId[0] + " - remz: " + remId[1]);
        //console.log("gridPos - x: " + gridPos[0] + " - z: " + gridPos[1]);
        //console.log("newGridPos - x: " + newGridPos[0] + " - z: " + newGridPos[1]);
        remBlock(remId[0],remId[1]);
        labyrinth(genId[0],genId[1]);

        gridPos[0] = newGridPos[0];
        gridPos[1] = newGridPos[1];

        paramBox.innerHTML = "camera.z:" + posZ + "<br>" + "camera.x:" + posX + "<br>" + "gridX: " + newGridPos[0] + "<br>" + "gridZ: " + newGridPos[1];
    }

    

    renderer.render( scene, camera );

    stats.end();

    

}