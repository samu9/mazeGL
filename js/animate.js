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
    var timestampNow = new Date().getTime()/1000.0;
    var lightEffect = 1;//0.25 * Math.cos(timestampNow * Math.PI);

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
    
    //wallMaterial.uniforms.cameraX.value = controls.getObject().position.x * 0.1;
    //wallMaterial.uniforms.cameraZ.value = controls.getObject().position.z * 0.1;

    //wallMaterial.uniforms.effect.value = lightEffect;

    var direction;
    if((gridPos[0] != newGridPos[0]) || (gridPos[1] != newGridPos[1])){
        
        direction = [newGridPos[0] - gridPos[0], newGridPos[1] - gridPos[1]];
        
        //console.clear();

        buildGrid(newGridPos,direction); //ricostruisco la mappa già generata che è in griglia

        reorderBlocks(); //riordino i blocchi da cui generare in base alla distanza

        while(closestBlocks.length > 0){ 
            labyrinth(); //genero il labirinto
            reorderBlocks(); //riordino
        }
            
        clearGrid(newGridPos,direction); //rimuovo i blocchi fuori griglia
        
        gridPos[0] = newGridPos[0];
        gridPos[1] = newGridPos[1];

        //stampo posizione e lista dei blocchi
        var temp = "closestBlocks:<br>";
        for(var i = 0; i < closestBlocks.length; i++)
            temp += closestBlocks[i] + "<br>";

        temp += "nextBlocks:<br>";
        for(var i = 0; i < nextBlocks.length; i++)
            temp += nextBlocks[i] + "<br>"; 
        paramBox.innerHTML = "gridX: " + newGridPos[0] + "<br>" + "gridZ: " + newGridPos[1] + "<br>" + temp;
    }

    

    renderer.render( scene, camera );

    stats.end();
}